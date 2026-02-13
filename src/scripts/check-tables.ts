import { prisma } from "@/lib/prisma";

async function checkTables() {
  try {
    const result = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('\n✅ Conexión exitosa a la base de datos');
    console.log('\n📋 Tablas encontradas:');
    if (result.length === 0) {
      console.log('   ⚠️  No hay tablas en el schema public');
      console.log('   ℹ️  Necesitas ejecutar: npx prisma migrate dev');
    } else {
      result.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    console.log(`\nTotal: ${result.length} tablas\n`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
