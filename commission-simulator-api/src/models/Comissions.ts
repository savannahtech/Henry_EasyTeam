const _commissions = require('mongoose');

const commissionPlanSchema = new _commissions.Schema({
  product: {
    type: _commissions.Schema.Types.ObjectId,
    ref: 'Product'
  },
  commissionPercent: {
    type: Number,
    required: true
  }
});

module.exports = _commissions.model('CommissionPlan', commissionPlanSchema);
