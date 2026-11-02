// Comprehensive End-to-End Test Suite for Eco-Smart Platform Backend
const BASE_URL = 'http://localhost:3000/api';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 ECO-SMART PLATFORM COMPLETE BACKEND TEST SUITE');
  console.log('====================================================\n');

  let studentToken = '';
  let adminToken = '';
  let newReportId = '';
  let newCivicId = '';
  let newMarketId = '';
  let newFoodId = '';
  let newPostId = '';
  let newProjectId = '';

  // 1. Health Endpoint
  console.log('1. Health & Platform Status');
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.status === 200, `Health status code is 200 (got ${res.status})`);
    assert(data.status === 'ok', `Health status is 'ok'`);
    assert(data.platform.includes('Eco-Smart'), `Platform name is correct`);
    assert(data.stats && data.stats.users >= 5, `Initial seed users loaded (>=5)`);
  } catch (err) {
    assert(false, `Health check threw error: ${err.message}`);
  }

  // 2. Authentication - Register
  console.log('\n2. User Authentication: Registration');
  const testEmail = `testuser_${Date.now()}@ecoverse.test`;
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aayush Test Contestant',
        email: testEmail,
        password: 'Password123!',
        role: 'student',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, `Registration status is 201 Created (got ${res.status})`);
    assert(data.success === true, `Registration success flag is true`);
    assert(!!data.token, `Registration returned JWT token`);
    assert(data.user && data.user.email === testEmail, `User email matches`);
    assert(data.user.ecoPoints === 50, `Welcome bonus points awarded (50)`);
    studentToken = data.token;
  } catch (err) {
    assert(false, `Registration threw error: ${err.message}`);
  }

  // 3. Authentication - Login with default Admin
  console.log('\n3. User Authentication: Login (Admin & Student)');
  try {
    const resAdmin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ecoverse.gov',
        password: 'admin123',
      }),
    });
    const dataAdmin = await resAdmin.json();
    assert(resAdmin.status === 200, `Admin login status is 200 (got ${resAdmin.status})`);
    assert(dataAdmin.success === true, `Admin login success is true`);
    assert(dataAdmin.user.role === 'admin', `Admin user has role 'admin'`);
    assert(!!dataAdmin.token, `Admin received valid JWT token`);
    adminToken = dataAdmin.token;

    // Test Invalid Login
    const resBad = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@ecoverse.gov',
        password: 'WrongPassword!',
      }),
    });
    assert(resBad.status === 401, `Invalid login correctly rejected with 401 (got ${resBad.status})`);
  } catch (err) {
    assert(false, `Login test threw error: ${err.message}`);
  }

  // 4. User Profile (GET & PATCH)
  console.log('\n4. User Profile (GET & PATCH)');
  try {
    const resProfile = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const dataProfile = await resProfile.json();
    assert(resProfile.status === 200, `Profile GET returns 200 with Bearer token`);
    assert(dataProfile.email === testEmail, `Profile matches authenticated user`);

    // Patch profile
    const resPatch = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        ecoPoints: 120,
        sustainabilityScore: 88,
        level: 'Eco Survivor (Tier 2)',
      }),
    });
    const dataPatch = await resPatch.json();
    assert(resPatch.status === 200, `Profile PATCH returns 200`);
    assert(dataPatch.user.ecoPoints === 120, `Patched points updated to 120`);
    assert(dataPatch.user.level === 'Eco Survivor (Tier 2)', `Patched level updated`);
  } catch (err) {
    assert(false, `Profile test threw error: ${err.message}`);
  }

  // 5. Admin User Management
  console.log('\n5. Users Directory & Promote Admin');
  try {
    const resUsers = await fetch(`${BASE_URL}/users`);
    const users = await resUsers.json();
    assert(resUsers.status === 200, `GET /api/users returns 200`);
    assert(Array.isArray(users) && users.length >= 6, `Users list returned array of users`);

    // Promote user to admin
    const resPromote = await fetch(`${BASE_URL}/auth/promote-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ emailOrId: testEmail }),
    });
    const dataPromote = await resPromote.json();
    assert(resPromote.status === 200, `Promote admin returns 200`);
    assert(dataPromote.user.role === 'admin', `Target user promoted to admin role`);
  } catch (err) {
    assert(false, `Users & promote test threw error: ${err.message}`);
  }

  // 6. Media Upload (Base64)
  console.log('\n6. Media Upload API');
  try {
    // 1x1 transparent GIF base64
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const resUpload = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: sampleBase64 }),
    });
    const dataUpload = await resUpload.json();
    assert(resUpload.status === 200, `Base64 upload returns 200`);
    assert(dataUpload.success === true, `Upload returned success`);
    assert(dataUpload.url && dataUpload.url.startsWith('/uploads/'), `Upload returned local accessible URL`);
  } catch (err) {
    assert(false, `Upload test threw error: ${err.message}`);
  }

  // 7. Waste Reports (GET, POST, VERIFY, DELETE)
  console.log('\n7. Waste Reports Lifecycle');
  try {
    // GET all reports
    const resGet = await fetch(`${BASE_URL}/reports`);
    const allReports = await resGet.json();
    assert(resGet.status === 200, `GET /api/reports returns 200`);
    assert(Array.isArray(allReports), `Reports is an array`);

    // POST new waste report
    const resPost = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Sector 5 Overflowing Plastic Bin',
        location: 'Sector 5 Near Cafeteria East',
        detectedMaterials: ['PET Plastic Bottle', 'Cardboard Box'],
        estimatedQuantityKg: 18.5,
        severity: 'High',
        recyclablePercentage: 85,
        imageUrl: '/uploads/sample.jpg',
        nearestCollectionPoint: 'Eco Hub #2',
        distanceMeters: 140,
        pointsAwarded: 10,
      }),
    });
    const newReport = await resPost.json();
    assert(resPost.status === 201, `POST /api/reports returns 201 Created`);
    assert(!!newReport.id, `Created report has valid ID: ${newReport.id}`);
    assert(newReport.status === 'Reported', `Initial status is 'Reported'`);
    newReportId = newReport.id;

    // PATCH verify/clean report
    const resVerify = await fetch(`${BASE_URL}/reports/${newReportId}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ approve: true }),
    });
    const dataVerify = await resVerify.json();
    assert(resVerify.status === 200, `PATCH /api/reports/:id/verify returns 200`);
    assert(dataVerify.report.status === 'Cleaned', `Report status changed to 'Cleaned'`);

    // GET single report
    const resSingle = await fetch(`${BASE_URL}/reports/${newReportId}`);
    const single = await resSingle.json();
    assert(single.id === newReportId, `Single report retrieval matches ID`);
    assert(single.status === 'Cleaned', `Cleaned status persisted`);
  } catch (err) {
    assert(false, `Waste report lifecycle threw error: ${err.message}`);
  }

  // 8. Civic Reports (GET, POST, PATCH, DELETE)
  console.log('\n8. Civic Grievance Reports');
  try {
    const resGetCivic = await fetch(`${BASE_URL}/civic-reports`);
    assert(resGetCivic.status === 200, `GET /api/civic-reports returns 200`);

    const resPostCivic = await fetch(`${BASE_URL}/civic-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Broken Main Water Valve Leaking',
        category: 'Water Leakage',
        location: 'Sector 9 Hostels Quad',
        severity: 'High',
        authorityTag: 'Water Works & Sanitation Board',
      }),
    });
    const civicData = await resPostCivic.json();
    assert(resPostCivic.status === 201, `POST /api/civic-reports returns 201`);
    assert(civicData.category === 'Water Leakage', `Category preserved`);
    newCivicId = civicData.id;

    // Update status to 'Assigned'
    const resPatchCivic = await fetch(`${BASE_URL}/civic-reports/${newCivicId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Assigned', confirmationsCount: 3 }),
    });
    const patchedCivic = await resPatchCivic.json();
    assert(patchedCivic.report.status === 'Assigned', `Civic report status updated to 'Assigned'`);
  } catch (err) {
    assert(false, `Civic reports test threw error: ${err.message}`);
  }

  // 9. Marketplace & Circular Scrap Matchmaking
  console.log('\n9. Marketplace & Industry B2B Demands');
  try {
    const resGetMarket = await fetch(`${BASE_URL}/market`);
    assert(resGetMarket.status === 200, `GET /api/market returns 200`);

    const resPostMarket = await fetch(`${BASE_URL}/market`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Baled Clean PET Bottles (25 kg)',
        category: 'Plastic',
        quantity: '25 kg',
        priceInr: 650,
        condition: 'Good',
        location: 'Campus South Warehouse',
      }),
    });
    const marketItem = await resPostMarket.json();
    assert(resPostMarket.status === 201, `POST /api/market returns 201`);
    assert(marketItem.priceInr === 650, `Price correctly stored`);
    newMarketId = marketItem.id;

    // Industry Demands & B2B Match
    const resDemands = await fetch(`${BASE_URL}/industry-demands`);
    const demands = await resDemands.json();
    assert(resDemands.status === 200, `GET /api/industry-demands returns 200`);
    assert(demands.length > 0, `Active industry demands found`);

    const firstDemand = demands[0];
    const resOffer = await fetch(`${BASE_URL}/industry-demands/${firstDemand.id}/offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ quantityKg: 20 }),
    });
    const offerData = await resOffer.json();
    assert(resOffer.status === 200, `POST /api/industry-demands/:id/offer returns 200`);
    assert(offerData.success === true, `Match confirmed with industry buyer`);
    assert(offerData.earnedInr > 0, `Cash payout calculated: ₹${offerData.earnedInr}`);
  } catch (err) {
    assert(false, `Marketplace test threw error: ${err.message}`);
  }

  // 10. EcoFood Surplus Rescue Network
  console.log('\n10. EcoFood Surplus Rescue Network');
  try {
    const resGetFood = await fetch(`${BASE_URL}/food`);
    assert(resGetFood.status === 200, `GET /api/food returns 200`);

    const resPostFood = await fetch(`${BASE_URL}/food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        restaurantName: 'Subway Central Campus',
        foodName: 'Fresh Veg & Paneer Subs (Pack of 5)',
        category: 'Meals',
        quantityLabel: '5 Servings',
        originalPriceInr: 750,
        discountedPriceInr: 199,
        availableServings: 5,
        location: 'Food Court Level 1',
      }),
    });
    const foodItem = await resPostFood.json();
    assert(resPostFood.status === 201, `POST /api/food returns 201`);
    assert(foodItem.availableServings === 5, `Available servings initialized to 5`);
    newFoodId = foodItem.id;

    // Reserve 1 serving
    const resReserve = await fetch(`${BASE_URL}/food/${newFoodId}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
    });
    const reserveData = await resReserve.json();
    assert(resReserve.status === 200, `Reserve surplus meal returns 200`);
    assert(reserveData.food.availableServings === 4, `Servings decremented to 4`);
  } catch (err) {
    assert(false, `EcoFood test threw error: ${err.message}`);
  }

  // 11. Social Posts, Comments & Likes
  console.log('\n11. Community Social Feed & Interaction');
  try {
    const resGetPosts = await fetch(`${BASE_URL}/posts`);
    assert(resGetPosts.status === 200, `GET /api/posts returns 200`);

    const resPostPost = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        content: 'Cleaned up Sector 3 park with the Eco Warriors team! Diverted 25kg of PET plastics.',
        postType: 'Contribution',
        locationTag: 'Indore Sector 3 Park',
        impactBadge: '🌱 25kg Diverted',
      }),
    });
    const postData = await resPostPost.json();
    assert(resPostPost.status === 201, `POST /api/posts returns 201`);
    newPostId = postData.id;

    // Add comment
    const resComment = await fetch(`${BASE_URL}/posts/${newPostId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ text: 'Incredible work team! Inspired to do the same.' }),
    });
    const commentData = await resComment.json();
    assert(resComment.status === 200, `Add comment returns 200`);
    assert(commentData.post.comments.length === 1, `Post comments count is 1`);

    // Like post
    const resLike = await fetch(`${BASE_URL}/posts/${newPostId}/like`, {
      method: 'POST',
    });
    const likeData = await resLike.json();
    assert(resLike.status === 200, `Like post returns 200`);
  } catch (err) {
    assert(false, `Social feed test threw error: ${err.message}`);
  }

  // 12. Community Projects (Upcycling & Circular DIY)
  console.log('\n12. Community Projects & Material Donations');
  try {
    const resProjects = await fetch(`${BASE_URL}/community/projects`);
    assert(resProjects.status === 200, `GET /api/community/projects returns 200`);

    const resPostProject = await fetch(`${BASE_URL}/community/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Solar-Powered Upcycled E-Waste Charging Kiosk',
        description: 'Using scrap PC power supplies and reclaimed batteries for public charging.',
        materialsTarget: 50,
        materialsUnit: 'units',
      }),
    });
    const projectData = await resPostProject.json();
    assert(resPostProject.status === 201, `Create community project returns 201`);
    newProjectId = projectData.id;

    // Join project
    const resJoin = await fetch(`${BASE_URL}/community/projects/${newProjectId}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const joinData = await resJoin.json();
    assert(resJoin.status === 200, `Join project returns 200`);
    assert(joinData.project.studentsJoined === 2, `Joined count incremented`);

    // Donate material to project
    const resDonate = await fetch(`${BASE_URL}/community/projects/${newProjectId}/donate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ itemLabel: 'Old PC Power Supplies', amount: 10 }),
    });
    const donateData = await resDonate.json();
    assert(resDonate.status === 200, `Donate materials returns 200`);
    assert(donateData.project.materialsCurrent === 10, `Materials current updated to 10`);
    assert(donateData.project.progressPercentage === 20, `Progress percentage calculated (20%)`);
  } catch (err) {
    assert(false, `Community projects test threw error: ${err.message}`);
  }

  // 13. Rewards, Partners & Cryptographic Vouchers
  console.log('\n13. Rewards & Merchant Partner Vouchers');
  try {
    const resRewards = await fetch(`${BASE_URL}/rewards`);
    assert(resRewards.status === 200, `GET /api/rewards returns 200`);

    const resPartners = await fetch(`${BASE_URL}/rewards/partners`);
    assert(resPartners.status === 200, `GET /api/rewards/partners returns 200`);

    // Redeem voucher
    const resRedeem = await fetch(`${BASE_URL}/rewards/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: '₹50 OFF Sustainable Brew at Green Cafe',
        businessName: 'Green Cafe Partner',
        pointsCost: 50,
        discountInr: 50,
      }),
    });
    const redeemData = await resRedeem.json();
    assert(resRedeem.status === 201, `Redeem voucher returns 201`);
    assert(redeemData.voucher && redeemData.voucher.voucherCode.startsWith('ECO-'), `Generated valid voucher code: ${redeemData.voucher?.voucherCode}`);
    assert(!!redeemData.voucher.qrCodePlaceholder, `QR code image URL generated`);

    // GET vouchers
    const resVouchers = await fetch(`${BASE_URL}/rewards/vouchers`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const vouchers = await resVouchers.json();
    assert(resVouchers.status === 200, `GET /api/rewards/vouchers returns 200`);
    assert(vouchers.some(v => v.voucherCode === redeemData.voucher.voucherCode), `Redeemed voucher found in user vault`);
  } catch (err) {
    assert(false, `Rewards test threw error: ${err.message}`);
  }

  // 14. CSR Corporate Impact Arena
  console.log('\n14. CSR Corporate Impact Arena');
  try {
    const resCompanies = await fetch(`${BASE_URL}/csr/companies`);
    assert(resCompanies.status === 200, `GET /api/csr/companies returns 200`);

    const resMissions = await fetch(`${BASE_URL}/csr/missions`);
    const missions = await resMissions.json();
    assert(resMissions.status === 200, `GET /api/csr/missions returns 200`);

    if (missions.length > 0) {
      const resJoinMission = await fetch(`${BASE_URL}/csr/missions/${missions[0].id}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      assert(resJoinMission.status === 200, `Join CSR Mission returns 200`);
    }

    const resCsrProjects = await fetch(`${BASE_URL}/csr/projects`);
    const csrProjects = await resCsrProjects.json();
    assert(resCsrProjects.status === 200, `GET /api/csr/projects returns 200`);

    if (csrProjects.length > 0) {
      const resFund = await fetch(`${BASE_URL}/csr/projects/${csrProjects[0].id}/fund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ amountInr: 50000 }),
      });
      const fundData = await resFund.json();
      assert(resFund.status === 200, `Fund CSR Project returns 200`);
      assert(fundData.success === true, `Funding allocated successfully`);
    }

    const resReports = await fetch(`${BASE_URL}/csr/reports`);
    assert(resReports.status === 200, `GET /api/csr/reports returns 200`);
  } catch (err) {
    assert(false, `CSR Arena test threw error: ${err.message}`);
  }

  // 15. Gamification (Leaderboard, Challenges, Daily Missions)
  console.log('\n15. Gamification & Challenges');
  try {
    const resLb = await fetch(`${BASE_URL}/gamification/leaderboard`);
    const lb = await resLb.json();
    assert(resLb.status === 200, `GET /api/gamification/leaderboard returns 200`);
    assert(Array.isArray(lb) && lb[0].rank === 1, `Leaderboard properly ranked with rank 1 first`);

    const resChall = await fetch(`${BASE_URL}/gamification/challenges`);
    assert(resChall.status === 200, `GET /api/gamification/challenges returns 200`);

    const resMissions = await fetch(`${BASE_URL}/gamification/daily-missions`);
    const dailyMissions = await resMissions.json();
    assert(resMissions.status === 200, `GET /api/gamification/daily-missions returns 200`);
    assert(dailyMissions.length === 6, `6 Daily sustainability quests returned`);
  } catch (err) {
    assert(false, `Gamification test threw error: ${err.message}`);
  }

  // 16. Telemetry & IoT Alerts
  console.log('\n16. Telemetry & SCADA IoT Data');
  try {
    const resTelem = await fetch(`${BASE_URL}/telemetry`);
    const telem = await resTelem.json();
    assert(resTelem.status === 200, `GET /api/telemetry returns 200`);
    assert(!!telem.energy && !!telem.water && !!telem.waste, `Telemetry includes energy, water, and waste`);

    const resAlerts = await fetch(`${BASE_URL}/telemetry/alerts`);
    assert(resAlerts.status === 200, `GET /api/telemetry/alerts returns 200`);
  } catch (err) {
    assert(false, `Telemetry test threw error: ${err.message}`);
  }

  // 17. Cleanup Operations
  console.log('\n17. Cleanup Dispatch Operations');
  try {
    const resOps = await fetch(`${BASE_URL}/cleanup-operations`);
    assert(resOps.status === 200, `GET /api/cleanup-operations returns 200`);

    const resPostOp = await fetch(`${BASE_URL}/cleanup-operations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'Sector 8 Food Street Waste Accumulation',
        priority: 'High',
        estimatedWasteKg: 220,
        assignedTeam: 'Field Squad Gamma',
      }),
    });
    const opData = await resPostOp.json();
    assert(resPostOp.status === 201, `POST /api/cleanup-operations returns 201`);
    assert(opData.priority === 'High', `Operation priority stored`);
  } catch (err) {
    assert(false, `Cleanup operations test threw error: ${err.message}`);
  }

  // 18. AI Copilot Chat Engine
  console.log('\n18. AI Copilot Chat Engine');
  try {
    const resChatPrice = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is the current scrap market price of plastic and aluminium?' }),
    });
    const chatPriceData = await resChatPrice.json();
    assert(resChatPrice.status === 200, `AI Chat returns 200`);
    assert(chatPriceData.reply.includes('PET Plastic'), `AI answers scrap pricing queries`);
    assert(chatPriceData.options && chatPriceData.options.length > 0, `AI returned contextual action buttons`);

    const resChatSegregate = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How do I segregate hazardous battery waste?' }),
    });
    const chatSegData = await resChatSegregate.json();
    assert(chatSegData.reply.includes('Bin'), `AI answers segregation rules`);
  } catch (err) {
    assert(false, `AI Copilot test threw error: ${err.message}`);
  }

  // 19. AI Computer Vision Waste Analysis
  console.log('\n19. AI Computer Vision & Waste Classifier');
  try {
    const sampleImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...';
    const resAnalyze = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: sampleImg }),
    });
    const analyzeData = await resAnalyze.json();
    assert(resAnalyze.status === 200, `POST /api/ai/analyze returns 200`);
    assert(analyzeData.success === true, `Analysis succeeded`);
    assert(Array.isArray(analyzeData.materials) && analyzeData.materials.length > 0, `Materials detected with confidence`);
    assert(analyzeData.estimated_kg > 0, `Estimated weight calculated: ${analyzeData.estimated_kg} kg`);
    assert(analyzeData.co2OffsetKg > 0, `CO2 offset calculated: ${analyzeData.co2OffsetKg} kg`);
    assert(!!analyzeData.nearestCollectionPoint, `Nearest collection point assigned`);
  } catch (err) {
    assert(false, `AI analyze test threw error: ${err.message}`);
  }

  // 20. AI Duplicate Check
  console.log('\n20. AI Geospatial Duplicate Detection');
  try {
    const resDup = await fetch(`${BASE_URL}/ai/duplicate-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'Sector 5 Near Cafeteria East',
        title: 'Plastic Bottle Pile',
        estimatedKg: 18.5,
      }),
    });
    const dupData = await resDup.json();
    assert(resDup.status === 200, `Duplicate check returns 200`);
    assert(typeof dupData.isDuplicate === 'boolean', `Returned boolean duplicate flag`);
    assert(dupData.similarityScore !== undefined, `Returned similarity score`);
  } catch (err) {
    assert(false, `Duplicate check test threw error: ${err.message}`);
  }

  // 21. Admin Platform Stats & Purge
  console.log('\n21. Admin Platform Aggregated Stats');
  try {
    const resStats = await fetch(`${BASE_URL}/admin/stats`);
    const statsData = await resStats.json();
    assert(resStats.status === 200, `GET /api/admin/stats returns 200`);
    assert(statsData.totalReports > 0, `Total reports aggregated`);
    assert(statsData.wasteDivertedKg >= 0, `Waste diverted metric aggregated`);
    assert(statsData.totalUsers > 0, `Total users aggregated`);
  } catch (err) {
    assert(false, `Admin stats test threw error: ${err.message}`);
  }

  // Clean-up deleted items test
  console.log('\n22. DELETE Operations & Data Cleanup');
  try {
    if (newReportId) {
      const resDel = await fetch(`${BASE_URL}/reports/${newReportId}`, { method: 'DELETE' });
      assert(resDel.status === 200, `DELETE /api/reports/:id succeeds`);
    }
    if (newCivicId) {
      const resDel = await fetch(`${BASE_URL}/civic-reports/${newCivicId}`, { method: 'DELETE' });
      assert(resDel.status === 200, `DELETE /api/civic-reports/:id succeeds`);
    }
    if (newMarketId) {
      const resDel = await fetch(`${BASE_URL}/market/${newMarketId}`, { method: 'DELETE' });
      assert(resDel.status === 200, `DELETE /api/market/:id succeeds`);
    }
    if (newFoodId) {
      const resDel = await fetch(`${BASE_URL}/food/${newFoodId}`, { method: 'DELETE' });
      assert(resDel.status === 200, `DELETE /api/food/:id succeeds`);
    }
    if (newPostId) {
      const resDel = await fetch(`${BASE_URL}/posts/${newPostId}`, { method: 'DELETE' });
      assert(resDel.status === 200, `DELETE /api/posts/:id succeeds`);
    }
  } catch (err) {
    assert(false, `Delete test threw error: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS SUMMARY`);
  console.log(`Total Assertions: ${totalTests}`);
  console.log(`Passed:           ${passedTests} ✅`);
  console.log(`Failed:           ${failedTests} ❌`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL BACKEND FEATURES VERIFIED AND PASSING SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runTests();

