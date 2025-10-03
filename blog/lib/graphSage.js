import { driver } from "@/lib/neo4j";

/**
 * Helper function to safely convert Neo4j integers to JavaScript numbers
 */
function safeToNumber(value) {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && value !== null) {
        // Handle Neo4j Integer objects
        if (value.low !== undefined) return value.low;
        if (value.toNumber && typeof value.toNumber === 'function') return value.toNumber();
    }
    return parseInt(value) || 0;
}

/**
 * Generate comprehensive post embeddings using GraphSAGE neural network approach
 * This implementation creates embeddings based on post content, structure, and graph relationships
 */

/**
 * Initialize or update post node features for GraphSAGE processing
 */
async function initializePostFeatures(postId) {
    const neo4jSession = driver.session();
    
    try {
        // Calculate and store post features for GraphSAGE
        await neo4jSession.run(`
            MATCH (p:Post {id: $postId})
            OPTIONAL MATCH (p)<-[:LIKED]-(likeUser:User)
            OPTIONAL MATCH (p)<-[:COMMENTED_ON]-(comment:Comment)
            OPTIONAL MATCH (p)-[:TAGGED_WITH]->(tag:Tag)
            OPTIONAL MATCH (p)-[:IN_CATEGORY]->(cat:Category)
            OPTIONAL MATCH (p)<-[:AUTHORED]-(author:User)
            
            WITH p, 
                 count(DISTINCT likeUser) as likeCount,
                 count(DISTINCT comment) as commentCount,
                 count(DISTINCT tag) as tagCount,
                 cat,
                 cat.name as category,
                 author.name as authorName
            
            SET p.featureTitleLength = toFloat(size(p.title)),
                p.featureContentLength = toFloat(size(p.content)),
                p.featureLikeCount = toFloat(likeCount),
                p.featureCommentCount = toFloat(commentCount),
                p.featureTagCount = toFloat(tagCount),
                p.featureEngagementScore = toFloat(likeCount + commentCount * 2),
                p.featureContentComplexity = toFloat(size(split(p.content, ' '))),
                p.featureHasCategory = toFloat(CASE WHEN cat IS NOT NULL THEN 1.0 ELSE 0.0 END),
                p.featureAuthorActivity = toFloat(CASE WHEN authorName IS NOT NULL THEN 1.0 ELSE 0.0 END),
                p.featureRecency = toFloat(CASE WHEN p.createdAt IS NOT NULL THEN duration.between(p.createdAt, datetime()).days ELSE 0 END),
                p.lastFeatureUpdate = datetime()
            
            RETURN p.id as postId, 
                   p.featureTitleLength as titleLength,
                   p.featureContentLength as contentLength,
                   p.featureLikeCount as likes,
                   p.featureCommentCount as comments
        `, { postId });
        
        console.log(`✅ Initialized features for post ${postId}`);
        
    } catch (error) {
        console.error("Error initializing post features:", error);
        throw error;
    } finally {
        await neo4jSession.close();
    }
}

/**
 * Create comprehensive graph projection for GraphSAGE with all node types and relationships
 */
async function createGraphProjection(graphName = 'blog-graph') {
    const neo4jSession = driver.session();
    
    try {
        // Drop existing graph if it exists
        try {
            const exists = await neo4jSession.run(`CALL gds.graph.exists($graphName) YIELD exists RETURN exists`, { graphName });
            if (exists.records[0].get('exists')) {
                await neo4jSession.run(`CALL gds.graph.drop($graphName)`, { graphName });
                console.log(`Dropped existing graph: ${graphName}`);
            }
        } catch (dropError) {
            console.log("No existing graph to drop");
        }

        // Check available labels and relationships
        const labelsResult = await neo4jSession.run(`CALL db.labels() YIELD label RETURN collect(label) as labels`);
        const relsResult = await neo4jSession.run(`CALL db.relationshipTypes() YIELD relationshipType RETURN collect(relationshipType) as relationships`);
        
        const availableLabels = labelsResult.records[0].get('labels');
        const availableRels = relsResult.records[0].get('relationships');
        
        console.log("Available labels:", availableLabels);
        console.log("Available relationships:", availableRels);

        // Build node projection dynamically based on available labels
        const nodeProjection = {};
        const relationshipProjection = {};

        // Post nodes with rich feature set
        if (availableLabels.includes('Post')) {
            nodeProjection.Post = {
                properties: {
                    titleLength: { property: 'featureTitleLength', defaultValue: 0.0 },
                    contentLength: { property: 'featureContentLength', defaultValue: 0.0 },
                    likeCount: { property: 'featureLikeCount', defaultValue: 0.0 },
                    commentCount: { property: 'featureCommentCount', defaultValue: 0.0 },
                    tagCount: { property: 'featureTagCount', defaultValue: 0.0 },
                    engagementScore: { property: 'featureEngagementScore', defaultValue: 0.0 },
                    contentComplexity: { property: 'featureContentComplexity', defaultValue: 0.0 },
                    hasCategory: { property: 'featureHasCategory', defaultValue: 0.0 },
                    authorActivity: { property: 'featureAuthorActivity', defaultValue: 0.0 },
                    recency: { property: 'featureRecency', defaultValue: 0.0 }
                }
            };
        }

        // User nodes - only include if they have actual properties we can use
        if (availableLabels.includes('User')) {
            nodeProjection.User = {};
        }

        // Category nodes
        if (availableLabels.includes('Category')) {
            nodeProjection.Category = {};
        }

        // Tag nodes
        if (availableLabels.includes('Tag')) {
            nodeProjection.Tag = {};
        }

        // Comment nodes
        if (availableLabels.includes('Comment')) {
            nodeProjection.Comment = {};
        }

        // Build relationship projection based on available relationships
        if (availableRels.includes('AUTHORED')) {
            relationshipProjection.AUTHORED = { 
                orientation: 'UNDIRECTED',
                properties: { weight: { defaultValue: 2.0 } }
            };
        }
        
        if (availableRels.includes('IN_CATEGORY')) {
            relationshipProjection.IN_CATEGORY = { 
                orientation: 'UNDIRECTED',
                properties: { weight: { defaultValue: 3.0 } }
            };
        }
        
        if (availableRels.includes('TAGGED_WITH')) {
            relationshipProjection.TAGGED_WITH = { 
                orientation: 'UNDIRECTED',
                properties: { weight: { defaultValue: 1.5 } }
            };
        }
        
        if (availableRels.includes('LIKED')) {
            relationshipProjection.LIKED = { 
                orientation: 'UNDIRECTED',
                properties: { weight: { defaultValue: 1.0 } }
            };
        }
        
        if (availableRels.includes('COMMENTED_ON')) {
            relationshipProjection.COMMENTED_ON = { 
                orientation: 'UNDIRECTED',
                properties: { weight: { defaultValue: 1.5 } }
            };
        }
        
        if (availableRels.includes('REPLY_TO')) {
            relationshipProjection.REPLY_TO = { 
                orientation: 'UNDIRECTED',
                properties: { weight: { defaultValue: 0.5 } }
            };
        }

        if (availableRels.includes('WROTE')) {
            relationshipProjection.WROTE = { 
                orientation: 'UNDIRECTED',
                properties: { weight: { defaultValue: 1.0 } }
            };
        }

        // Create the graph projection
        const projectionResult = await neo4jSession.run(`
            CALL gds.graph.project(
                $graphName,
                $nodeProjection,
                $relationshipProjection
            )
            YIELD graphName, nodeCount, relationshipCount, projectMillis
            RETURN graphName, nodeCount, relationshipCount, projectMillis
        `, {
            graphName,
            nodeProjection,
            relationshipProjection
        });

        const result = projectionResult.records[0];
        console.log(`✅ Graph projection created: ${result.get('graphName')}`);
        console.log(`📊 Nodes: ${result.get('nodeCount')}, Relationships: ${result.get('relationshipCount')}`);
        console.log(`⏱️ Projection time: ${result.get('projectMillis')}ms`);

        return {
            graphName: result.get('graphName'),
            nodeCount: safeToNumber(result.get('nodeCount')),
            relationshipCount: safeToNumber(result.get('relationshipCount')),
            projectMillis: safeToNumber(result.get('projectMillis'))
        };

    } catch (error) {
        console.error("Error creating graph projection:", error);
        throw error;
    } finally {
        await neo4jSession.close();
    }
}

/**
 * Generate GraphSAGE embeddings for all posts or a specific post
 */
export async function generatePostEmbedding(postId = null, forceRefresh = false) {
    const neo4jSession = driver.session();

    try {
        // Check if embedding already exists for specific post
        if (postId && !forceRefresh) {
            const existingResult = await neo4jSession.run(
                `MATCH (p:Post {id: $postId})
                 WHERE p.embedding IS NOT NULL
                 RETURN p.embedding AS embedding, p.embeddingMethod as method, p.embeddingGeneratedAt as generatedAt`,
                { postId }
            );
            
            if (existingResult.records.length > 0) {
                return {
                    postId,
                    embedding: existingResult.records[0].get("embedding"),
                    method: existingResult.records[0].get("method") || 'graphsage',
                    generatedAt: existingResult.records[0].get("generatedAt"),
                    cached: true
                };
            }
        }

        // Initialize features for the specific post or all posts
        if (postId) {
            await initializePostFeatures(postId);
        } else {
            // Initialize features for all posts
            const postsResult = await neo4jSession.run(`MATCH (p:Post) RETURN p.id as postId`);
            const postIds = postsResult.records.map(record => record.get('postId'));
            
            for (const id of postIds) {
                await initializePostFeatures(id);
            }
        }

        // Create graph projection
        const graphInfo = await createGraphProjection('blog-graph');
        
        if (graphInfo.nodeCount === 0) {
            throw new Error("No nodes found in graph projection");
        }

        console.log("🧠 Running GraphSAGE algorithm...");

        // Run GraphSAGE algorithm
        const graphSageResult = await neo4jSession.run(`
            CALL gds.beta.graphSage.train('blog-graph', {
                modelName: 'blog-graphsage-model',
                featureProperties: [
                    'titleLength', 'contentLength', 'likeCount', 'commentCount', 
                    'tagCount', 'engagementScore', 'contentComplexity', 
                    'hasCategory', 'authorActivity', 'recency'
                ],
                embeddingDimension: 128,
                aggregator: 'mean',
                activationFunction: 'relu',
                sampleSizes: [25, 10],
                degreeAsProperty: true,
                epochs: 10,
                learningRate: 0.01,
                batchSize: 256,
                tolerance: 1e-4,
                randomSeed: 42
            })
            YIELD modelInfo, configuration, trainMillis
            RETURN modelInfo, configuration, trainMillis
        `);

        const trainResult = graphSageResult.records[0];
        console.log(`✅ GraphSAGE model trained in ${trainResult.get('trainMillis')}ms`);

        // Generate embeddings using the trained model
        const embeddingQuery = postId ? 
            `CALL gds.beta.graphSage.stream('blog-graph', {
                modelName: 'blog-graphsage-model'
            })
            YIELD nodeId, embedding
            WITH gds.util.asNode(nodeId) AS n, embedding
            WHERE n:Post AND n.id = $postId
            SET n.embedding = embedding,
                n.embeddingGeneratedAt = datetime(),
                n.embeddingMethod = 'graphsage',
                n.embeddingDimensions = 128
            RETURN n.id AS postId, n.embedding AS embedding` :
            `CALL gds.beta.graphSage.stream('blog-graph', {
                modelName: 'blog-graphsage-model'
            })
            YIELD nodeId, embedding
            WITH gds.util.asNode(nodeId) AS n, embedding
            WHERE n:Post
            SET n.embedding = embedding,
                n.embeddingGeneratedAt = datetime(),
                n.embeddingMethod = 'graphsage',
                n.embeddingDimensions = 128
            RETURN n.id AS postId, n.embedding AS embedding`;

        const embeddingResult = await neo4jSession.run(embeddingQuery, postId ? { postId } : {});

        // Clean up - drop model and graph
        await neo4jSession.run(`CALL gds.beta.model.drop('blog-graphsage-model')`);
        await neo4jSession.run(`CALL gds.graph.drop('blog-graph')`);

        if (embeddingResult.records.length === 0) {
            throw new Error("No embeddings generated");
        }

        console.log(`✅ Generated GraphSAGE embeddings for ${embeddingResult.records.length} posts`);

        if (postId) {
            // Return single post embedding
            const record = embeddingResult.records[0];
            return {
                postId: record.get("postId"),
                embedding: record.get("embedding"),
                method: 'graphsage',
                dimensions: 128,
                cached: false
            };
        } else {
            // Return all post embeddings
            return embeddingResult.records.map(record => ({
                postId: record.get("postId"),
                embedding: record.get("embedding"),
                method: 'graphsage',
                dimensions: 128,
                cached: false
            }));
        }

    } catch (error) {
        console.error("GraphSAGE embedding generation failed:", error);
        
        // Fallback to simple feature-based embedding
        console.log("🔄 Falling back to simple embedding method...");
        return await generateSimpleEmbedding(postId);
        
    } finally {
        await neo4jSession.close();
    }
}

/**
 * Fallback: Generate simple feature-based embedding
 */
async function generateSimpleEmbedding(postId) {
    const neo4jSession = driver.session();
    
    try {
        const result = await neo4jSession.run(`
            MATCH (p:Post {id: $postId})
            OPTIONAL MATCH (p)<-[:LIKED]-(likeUser:User)
            OPTIONAL MATCH (p)<-[:COMMENTED_ON]-(comment:Comment)
            OPTIONAL MATCH (p)-[:TAGGED_WITH]->(tag:Tag)
            OPTIONAL MATCH (p)-[:IN_CATEGORY]->(cat:Category)
            
            WITH p, 
                 count(DISTINCT likeUser) as likeCount,
                 count(DISTINCT comment) as commentCount, 
                 collect(DISTINCT tag.name) as tags,
                 cat.name as category
                 
            RETURN p.title as title,
                   p.content as content,
                   likeCount,
                   commentCount,
                   tags,
                   category,
                   size(p.title) as titleLength,
                   size(p.content) as contentLength
        `, { postId });
        
        if (result.records.length === 0) {
            throw new Error("Post not found");
        }
        
        const record = result.records[0];
        const title = record.get('title') || '';
        const content = record.get('content') || '';
        const likeCount = safeToNumber(record.get('likeCount'));
        const commentCount = safeToNumber(record.get('commentCount'));
        const tags = record.get('tags') || [];
        const category = record.get('category') || 'general';
        const titleLength = record.get('titleLength');
        const contentLength = record.get('contentLength');
        
        // Create 64-dimensional embedding
        const embedding = [];
        
        // Basic metrics (0-7)
        embedding.push(Math.min(titleLength / 100.0, 1.0));
        embedding.push(Math.min(contentLength / 5000.0, 1.0));
        embedding.push(Math.min(likeCount / 100.0, 1.0));
        embedding.push(Math.min(commentCount / 50.0, 1.0));
        embedding.push(Math.min(tags.length / 10.0, 1.0));
        embedding.push(likeCount > 0 ? 1.0 : 0.0);
        embedding.push(commentCount > 0 ? 1.0 : 0.0);
        embedding.push(tags.length > 0 ? 1.0 : 0.0);
        
        // Content analysis (8-23)
        const keywords = ['javascript', 'react', 'node', 'python', 'web', 'mobile', 'tutorial', 'guide',
                         'tips', 'beginner', 'advanced', 'framework', 'api', 'database', 'frontend', 'backend'];
        keywords.forEach(keyword => {
            const hasKeyword = title.toLowerCase().includes(keyword) || content.toLowerCase().includes(keyword);
            embedding.push(hasKeyword ? 1.0 : 0.0);
        });
        
        // Category features (24-39)
        const categories = ['technology', 'lifestyle', 'travel', 'health', 'business', 'education', 
                           'entertainment', 'sports', 'science', 'politics', 'food', 'fashion', 
                           'art', 'music', 'gaming', 'general'];
        categories.forEach(cat => {
            embedding.push(category.toLowerCase() === cat ? 1.0 : 0.0);
        });
        
        // Tag analysis (40-55)
        const commonTags = ['tutorial', 'guide', 'tips', 'howto', 'review', 'news', 'opinion', 'analysis',
                           'beginner', 'intermediate', 'advanced', 'case-study', 'example', 'demo', 'code', 'design'];
        commonTags.forEach(tag => {
            embedding.push(tags.some(t => t.toLowerCase().includes(tag)) ? 1.0 : 0.0);
        });
        
        // Engagement metrics (56-63)
        const totalEngagement = likeCount + commentCount;
        embedding.push(Math.min(totalEngagement / 150.0, 1.0));
        embedding.push(commentCount > 0 ? Math.min(likeCount / commentCount, 5.0) / 5.0 : 0);
        embedding.push(likeCount > 10 ? 1.0 : 0.0);
        embedding.push(commentCount > 5 ? 1.0 : 0.0);
        embedding.push(totalEngagement > 20 ? 1.0 : 0.0);
        embedding.push(Math.random() * 0.1);
        embedding.push(Math.random() * 0.1);
        embedding.push(Math.random() * 0.1);
        
        // Store embedding
        await neo4jSession.run(`
            MATCH (p:Post {id: $postId})
            SET p.embedding = $embedding,
                p.embeddingGeneratedAt = datetime(),
                p.embeddingMethod = 'simple',
                p.embeddingDimensions = 64
        `, { postId, embedding });
        
        console.log(`✅ Generated simple embedding for post ${postId}`);
        
        return {
            postId,
            embedding,
            method: 'simple',
            dimensions: 64,
            cached: false
        };
        
    } catch (error) {
        console.error("Error generating simple embedding:", error);
        throw error;
    } finally {
        await neo4jSession.close();
    }
}

/**
 * Check if post embedding needs refresh based on activity thresholds
 */
export async function shouldRefreshEmbedding(postId) {
    const neo4jSession = driver.session();
    
    try {
        const result = await neo4jSession.run(`
            MATCH (p:Post {id: $postId})
            RETURN p.textChanges AS textChanges,
                   p.likesChange AS likesChange,
                   p.commentsChange AS commentsChange,
                   p.embedding IS NOT NULL AS hasEmbedding,
                   p.embeddingGeneratedAt AS lastGenerated
        `, { postId });

        if (result.records.length === 0) {
            return false;
        }

        const record = result.records[0];
        const textChanges = record.get("textChanges") || 0;
        const likesChange = record.get("likesChange") || 0; 
        const commentsChange = record.get("commentsChange") || 0;
        const hasEmbedding = record.get("hasEmbedding");
        const lastGenerated = record.get("lastGenerated");

        // Refresh thresholds
        const SIGNIFICANT_TEXT_CHANGE = 100;
        const SIGNIFICANT_LIKES_CHANGE = 50;
        const SIGNIFICANT_COMMENTS_CHANGE = 20;
        const MAX_AGE_DAYS = 30;

        // Check if embedding is too old
        let isOld = false;
        if (lastGenerated && typeof lastGenerated === 'object') {
            const now = new Date();
            const generated = new Date(lastGenerated.toString());
            const daysDiff = Math.floor((now - generated) / (1000 * 60 * 60 * 24));
            isOld = daysDiff > MAX_AGE_DAYS;
        }

        return !hasEmbedding || 
               textChanges >= SIGNIFICANT_TEXT_CHANGE ||
               likesChange >= SIGNIFICANT_LIKES_CHANGE ||
               commentsChange >= SIGNIFICANT_COMMENTS_CHANGE ||
               isOld;

    } finally {
        await neo4jSession.close();
    }
}

/**
 * Reset change tracking counters after embedding refresh
 */
export async function resetChangeCounters(postId) {
    const neo4jSession = driver.session();
    
    try {
        await neo4jSession.run(`
            MATCH (p:Post {id: $postId})
            SET p.textChanges = 0,
                p.likesChange = 0,
                p.commentsChange = 0,
                p.lastChangeReset = datetime()
        `, { postId });
    } finally {
        await neo4jSession.close();
    }
}

/**
 * Find similar posts using embedding cosine similarity
 */
export async function findSimilarPosts(postId, limit = 5) {
    const neo4jSession = driver.session();
    
    // Ensure limit is an integer
    const limitInt = parseInt(limit) || 5;
    console.log(`🔍 Finding similar posts for ${postId} with limit: ${limitInt} (type: ${typeof limitInt})`);
    
    try {
        // First try to use GDS cosine similarity if available
        try {
            const result = await neo4jSession.run(`
                MATCH (target:Post {id: $postId})
                WHERE target.embedding IS NOT NULL
                
                MATCH (other:Post)
                WHERE other.embedding IS NOT NULL AND other.id <> $postId
                
                WITH target, other,
                     gds.similarity.cosine(target.embedding, other.embedding) AS similarity
                
                RETURN other.id AS postId,
                       other.title AS title,
                       other.excerpt AS excerpt,
                       other.category AS category,
                       other.tags AS tags,
                       similarity,
                       other.featureLikeCount AS likes,
                       other.featureCommentCount AS comments
                ORDER BY similarity DESC
                LIMIT toInteger($limit)
            `, { postId, limit: limitInt });

            return result.records.map(record => ({
                postId: record.get("postId"),
                title: record.get("title"),
                excerpt: record.get("excerpt"),
                category: record.get("category"),
                tags: record.get("tags"),
                similarity: record.get("similarity"),
                likes: safeToNumber(record.get("likes")),
                comments: safeToNumber(record.get("comments"))
            }));
        } catch (gdsError) {
            console.log("🔄 GDS cosine similarity not available, using fallback method");
            
            // Fallback: find posts with similar characteristics
            const result = await neo4jSession.run(`
                MATCH (target:Post {id: $postId})
                OPTIONAL MATCH (target)-[:IN_CATEGORY]->(targetCat:Category)
                OPTIONAL MATCH (target)-[:TAGGED_WITH]->(targetTag:Tag)
                
                MATCH (other:Post)
                WHERE other.id <> $postId
                OPTIONAL MATCH (other)-[:IN_CATEGORY]->(otherCat:Category)
                OPTIONAL MATCH (other)-[:TAGGED_WITH]->(otherTag:Tag)
                OPTIONAL MATCH (other)<-[:LIKED]-(likeUser:User)
                OPTIONAL MATCH (other)<-[:COMMENTED_ON]-(comment:Comment)
                
                WITH target, other, targetCat, otherCat,
                     collect(DISTINCT targetTag.name) as targetTags,
                     collect(DISTINCT otherTag.name) as otherTags,
                     count(DISTINCT likeUser) as otherLikes,
                     count(DISTINCT comment) as otherComments
                
                WITH target, other, targetCat, otherCat, targetTags, otherTags, otherLikes, otherComments,
                     CASE WHEN targetCat.name = otherCat.name THEN 0.5 ELSE 0.0 END as categorySimilarity,
                     size([tag IN targetTags WHERE tag IN otherTags]) * 0.1 as tagSimilarity
                
                WITH target, other, categorySimilarity + tagSimilarity as similarity, otherLikes, otherComments
                WHERE similarity > 0
                
                RETURN other.id AS postId,
                       other.title AS title,
                       other.excerpt AS excerpt,
                       other.category AS category,
                       other.tags AS tags,
                       similarity,
                       otherLikes as likes,
                       otherComments as comments
                ORDER BY similarity DESC, otherLikes DESC, otherComments DESC
                LIMIT toInteger($limit)
            `, { postId, limit: limitInt });

            return result.records.map(record => ({
                postId: record.get("postId"),
                title: record.get("title"),
                excerpt: record.get("excerpt"),
                category: record.get("category"),
                tags: record.get("tags"),
                similarity: record.get("similarity"),
                likes: safeToNumber(record.get("likes")),
                comments: safeToNumber(record.get("comments"))
            }));
        }

        return result.records.map(record => ({
            postId: record.get("postId"),
            title: record.get("title"),
            excerpt: record.get("excerpt"),
            category: record.get("category"),
            tags: record.get("tags"),
            similarity: record.get("similarity"),
            likes: safeToNumber(record.get("likes")),
            comments: safeToNumber(record.get("comments"))
        }));

    } catch (error) {
        console.error("Error finding similar posts:", error);
        return [];
    } finally {
        await neo4jSession.close();
    }
}

/**
 * Batch generate embeddings for multiple posts
 */
export async function batchGenerateEmbeddings(postIds = null) {
    try {
        if (postIds) {
            const results = [];
            for (const postId of postIds) {
                try {
                    const result = await generatePostEmbedding(postId, true);
                    results.push(result);
                } catch (error) {
                    console.error(`Failed to generate embedding for post ${postId}:`, error);
                    results.push({ postId, error: error.message });
                }
            }
            return results;
        } else {
            // Generate for all posts
            return await generatePostEmbedding(null, true);
        }
    } catch (error) {
        console.error("Error in batch embedding generation:", error);
        throw error;
    }
}

/**
 * Get embedding statistics and health metrics
 */
export async function getEmbeddingStats() {
    const neo4jSession = driver.session();
    
    try {
        const result = await neo4jSession.run(`
            MATCH (p:Post)
            WITH count(p) AS totalPosts,
                 count(p.embedding) AS postsWithEmbedding,
                 collect(p.embeddingMethod) AS methods,
                 collect(p.embeddingDimensions) AS dimensions
            
            RETURN totalPosts,
                   postsWithEmbedding,
                   postsWithEmbedding * 100.0 / totalPosts AS coverage,
                   methods,
                   dimensions
        `);

        if (result.records.length === 0) {
            return {
                totalPosts: 0,
                postsWithEmbedding: 0,
                coverage: 0,
                methods: [],
                dimensions: []
            };
        }

        const record = result.records[0];
        const methods = record.get("methods").filter(m => m !== null);
        const dimensions = record.get("dimensions").filter(d => d !== null);

        return {
            totalPosts: safeToNumber(record.get("totalPosts")),
            postsWithEmbedding: safeToNumber(record.get("postsWithEmbedding")),
            coverage: record.get("coverage"),
            methods: [...new Set(methods)],
            dimensions: [...new Set(dimensions.map(d => safeToNumber(d)))]
        };

    } finally {
        await neo4jSession.close();
    }
}
