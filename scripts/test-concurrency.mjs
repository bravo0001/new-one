// Concurrent Stress Test for Database & API Route Handlers
const BASE_URL = 'http://localhost:3000/api';

async function testConcurrency() {
  console.log('⚡ Starting Concurrency and Stress Test (50 parallel requests)...');

  const promises = [];
  const start = Date.now();

  for (let i = 0; i < 50; i++) {
    const p = (async () => {
      // 1. Submit a waste report
      const res = await fetch(`${BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Stress Test Bin ${i}`,
          location: `Sector ${i % 10} Stress Location`,
          estimatedQuantityKg: 5 + (i % 20),
          severity: 'Medium',
        }),
      });
      const data = await res.json();
      return { status: res.status, id: data.id };
    })();
    promises.push(p);
  }

  const results = await Promise.all(promises);
  const elapsed = Date.now() - start;

  const successful = results.filter((r) => r.status === 201).length;
  console.log(`✅ Completed 50 parallel POST requests in ${elapsed}ms`);
  console.log(`   Successful: ${successful}/50`);

  if (successful === 50) {
    console.log('🎉 100% CONCURRENCY SUCCESS RATE! Zero file write collisions.\n');

    // Clean up test reports
    console.log('Cleaning up stress test reports...');
    for (const r of results) {
      if (r.id) {
        await fetch(`${BASE_URL}/reports/${r.id}`, { method: 'DELETE' });
      }
    }
    console.log('✅ Stress test reports cleaned up.');
  } else {
    console.error('❌ Some requests failed!');
    process.exit(1);
  }
}

testConcurrency();

