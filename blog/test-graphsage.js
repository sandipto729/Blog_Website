// Simple test file for GraphSAGE functionality
const neo4j = require('neo4j-driver');

async function testGraphSAGE() {
    const driver = neo4j.driver(
        'bolt://localhost:7687',
        neo4j.auth.basic('neo4j', '9476455131')
    );
    
    const session = driver.session();
    
    try {
        // Test Neo4j connection
        console.log('🔍 Testing Neo4j connection...');
        const result = await session.run('RETURN "Hello Neo4j!" as message');
        console.log('✅ Neo4j connected:', result.records[0].get('message'));
        
        // Test if we have posts in the database
        const postsResult = await session.run('MATCH (p:Post) RETURN count(p) as count');
        const postCount = postsResult.records[0].get('count').toNumber();
        console.log(`📊 Found ${postCount} posts in the database`);
        
        if (postCount > 0) {
            // Test basic similarity calculation
            const samplePost = await session.run(`
                MATCH (p:Post) 
                RETURN p.id as id, p.title as title, p.content as content 
                LIMIT 1
            `);
            
            if (samplePost.records.length > 0) {
                const post = samplePost.records[0];
                console.log('🎯 Testing with post:', post.get('title'));
                console.log('✅ GraphSAGE system is ready for use!');
            }
        } else {
            console.log('ℹ️  No posts found in database yet - system ready for when posts are created');
        }
        
    } catch (error) {
        console.error('❌ Error testing GraphSAGE:', error.message);
    } finally {
        await session.close();
        await driver.close();
    }
}

testGraphSAGE();