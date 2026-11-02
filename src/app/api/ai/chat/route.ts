import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message = '' } = await req.json();
    const cleanMsg = message.toLowerCase().trim();

    let reply = '';
    let options: { label: string; actionText: string }[] = [];

    if (cleanMsg.includes('price') || cleanMsg.includes('value') || cleanMsg.includes('rate') || cleanMsg.includes('worth')) {
      reply = `📊 **Current Scrap & Recyclable Valuation Benchmarks (Indore Market):**
• **PET Plastic Bottles**: ₹24 - ₹28 / kg
• **Aluminium Cans**: ₹95 - ₹115 / kg
• **Cardboard / OCC**: ₹11 - ₹14 / kg
• **Copper Wire / Motor Scrap**: ₹420 - ₹480 / kg
• **E-Waste (Motherboards/Circuits)**: ₹180 - ₹350 / kg

💡 *Tip: Bundle materials by category on EcoMarket to receive B2B industrial premiums!*`;
      options = [
        { label: 'List on EcoMarket', actionText: 'How do I list scrap on the marketplace?' },
        { label: 'View Industry Demand', actionText: 'Which factories are buying plastic right now?' },
      ];
    } else if (cleanMsg.includes('segregat') || cleanMsg.includes('sort') || cleanMsg.includes('classify') || cleanMsg.includes('where to throw')) {
      reply = `♻️ **Eco-Smart Segregation Matrix:**
1. **Green Bin (Wet / Biodegradable)**: Food scraps, vegetable peels, garden waste, tea bags.
2. **Blue Bin (Dry / Recyclable)**: Clean plastic containers, paper, glass bottles, metal cans.
3. **Black / Red Bin (Hazardous / E-Waste)**: Batteries, mobile chargers, fluorescent bulbs, paints.

⚠️ *Never mix electronics or batteries with organic waste, as toxic heavy metals contaminate compost!*`;
      options = [
        { label: 'Scan Waste with Camera', actionText: 'Help me analyze this waste photo' },
        { label: 'Find Nearest Bin', actionText: 'Show nearby recycling kiosks' },
      ];
    } else if (cleanMsg.includes('diy') || cleanMsg.includes('build') || cleanMsg.includes('upcycle') || cleanMsg.includes('reuse') || cleanMsg.includes('project')) {
      reply = `🛠️ **Top Circular Upcycling Recommendations:**
• **Eco-Brick Stools**: Pack clean, dry plastic wrappers into 1L PET bottles until dense (>0.33g/ml). Used for campus benches.
• **Vertical Hydroponic Planters**: Cut side apertures into 2L bottles, mount on bamboo lattice with drip irrigation.
• **E-Waste Keychains**: Dremel cut retired motherboard chips, polish edges, clear epoxy seal.

🎉 *Listing completed DIY projects awards up to +150 Eco Points!*`;
      options = [
        { label: 'Explore Community Projects', actionText: 'What projects are currently active?' },
        { label: 'Start New Project', actionText: 'How do I launch a student eco-project?' },
      ];
    } else if (cleanMsg.includes('point') || cleanMsg.includes('reward') || cleanMsg.includes('voucher') || cleanMsg.includes('level') || cleanMsg.includes('tier')) {
      reply = `🏆 **Eco Points & Gamification Breakdown:**
• **Report Waste**: +10 to +50 pts (Verified cleanup)
• **Marketplace Scrap Listing**: +50 pts
• **Food Rescue / Claim**: +30 pts
• **Upcycling DIY Project**: +40 pts

🎁 *Redeem points for discounts at local partner cafés, bookstores, and sustainable merchandise vendors!*`;
      options = [
        { label: 'View Rewards Vault', actionText: 'What rewards can I redeem today?' },
        { label: 'Check Leaderboard', actionText: 'Who is leading the campus rankings?' },
      ];
    } else if (cleanMsg.includes('food') || cleanMsg.includes('hunger') || cleanMsg.includes('meal') || cleanMsg.includes('restaurant')) {
      reply = `🍱 **EcoFood Surplus Rescue Network:**
Our platform pairs surplus commercial kitchen meals with students, campus workers, and local NGOs (like Robin Hood Army).
• Average meal savings: **60% - 80% OFF**
• Reduces methane emissions from landfill decomposition.
• Direct 1-click reservations with timed pickup windows.`;
      options = [
        { label: 'Reserve Surplus Meal', actionText: 'Show available meals near me' },
        { label: 'Offer to NGO', actionText: 'Connect with local food NGOs' },
      ];
    } else if (cleanMsg.includes('complaint') || cleanMsg.includes('dumping') || cleanMsg.includes('leak') || cleanMsg.includes('garbage') || cleanMsg.includes('municipal')) {
      reply = `🏛️ **Civic Infrastructure Grievance Routing:**
When you report illegal dumping or water leakage:
1. Automated geotagging & computer vision severity assignment.
2. Direct dispatch to the nearest Municipal Ward Sanitation Crew with SLA countdown.
3. Requires worker photo-proof before resolution sign-off.`;
      options = [
        { label: 'File Grievance Ticket', actionText: 'Report an illegal dumping hotspot' },
        { label: 'Track Active Tickets', actionText: 'Check status of municipal complaints' },
      ];
    } else {
      reply = `🌱 **Eco-Smart Copilot Online**
I can guide you on:
• **AI Waste Scanner**: Instant material segregation & carbon footprint calculations.
• **EcoMarket**: B2B scrap matchmaking and upcycled item trading.
• **EcoFood**: Rescuing surplus restaurant meals at steep discounts.
• **Civic SLA**: Municipal issue escalation with geotagged photo proof.
• **Rewards**: Converting Eco Points into merchant discount vouchers.

What would you like to explore?`;
      options = [
        { label: 'Scrap Market Values', actionText: 'What are scrap prices today?' },
        { label: 'DIY Upcycling Ideas', actionText: 'Give me a cool upcycling idea' },
        { label: 'Waste Segregation Guide', actionText: 'How should I segregate my waste?' },
      ];
    }

    return NextResponse.json({
      success: true,
      reply,
      options,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'AI Copilot processing error' },
      { status: 500 }
    );
  }
}

