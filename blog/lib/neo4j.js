import neo4j from "neo4j-driver"

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j", 
    process.env.NEO4J_PASSWORD || "password"
  )
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

export { ConnectDB, driver }
export default driver