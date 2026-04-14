/**
 * Conversion Engine for Smart Gaushala Assistant
 * Calculates conversion from cow dung and urine to profitable products
 */

const calculateConversion = (dungKg, urineL, laborHours, inputCost) => {
  try {
    // Validate inputs
    if (dungKg < 0 || urineL < 0 || laborHours < 0 || inputCost < 0) {
      throw new Error('All inputs must be non-negative');
    }

    // Conversion formulas
    const vermicompostYield = dungKg * 0.6; // kg
    const biopesticideVolume = urineL * 0.8; // litres
    
    // Revenue calculations (Rs)
    const vermicompostRevenue = vermicompostYield * 8;
    const biopesticideRevenue = biopesticideVolume * 15;
    
    // Labor cost calculation (Rs per hour)
    const laborCost = laborHours * 50; // Assuming Rs 50 per hour
    
    // Total revenue and profit
    const totalRevenue = vermicompostRevenue + biopesticideRevenue;
    const dailyProfit = totalRevenue - inputCost - laborCost;

    return {
      vermicompostYield: Math.round(vermicompostYield * 100) / 100,
      biopesticideVolume: Math.round(biopesticideVolume * 100) / 100,
      vermicompostRevenue: Math.round(vermicompostRevenue * 100) / 100,
      biopesticideRevenue: Math.round(biopesticideRevenue * 100) / 100,
      laborCost: Math.round(laborCost * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      dailyProfit: Math.round(dailyProfit * 100) / 100
    };
  } catch (error) {
    throw new Error(`Conversion calculation failed: ${error.message}`);
  }
};

module.exports = { calculateConversion };
