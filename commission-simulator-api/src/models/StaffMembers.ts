const _staff = require('mongoose');

const staffMemberSchema = new _staff.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = _staff.model('StaffMembers', staffMemberSchema);