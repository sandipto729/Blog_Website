import neo4j from "neo4j-driver"

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j", 
    process.env.NEO4J_PASSWORD || "password"
  ),
  {
    maxConnectionLifetime: 3 * 60 * 60 * 1000,
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 2 * 60 * 1000,
    disableLosslessIntegers: true
  }
)

const ConnectDB = async () => {
  try {
    await driver.verifyConnectivity()
    console.log("✅ Connected to Neo4j database successfully")
  } catch (error) {
    console.error("❌ Failed to connect to Neo4j database:", error.message)
    throw error
  }
}

export const executeNeo4jQuery = async (query, params = {}) => {
  const session = driver.session()
  try {
    const result = await session.run(query, params)
    return result
  } catch (error) {
    console.error('Neo4j query error:', error)
    throw error
  } finally {
    await session.close()
  }
}

export { ConnectDB, driver }
export default driver
