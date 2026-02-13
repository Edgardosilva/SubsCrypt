const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:51214/template1?sslmode=disable'
});

async function checkTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n✅ Conexión exitosa a la base de datos');
    console.log('\n📋 Tablas encontradas:');
    if (res.rows.length === 0) {
      console.log('   ⚠️  No hay tablas en el schema public');
    } else {
      res.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    console.log(`\nTotal: ${res.rows.length} tablas\n`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();
