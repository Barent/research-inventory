Freezers.allow({
	insert: function (userId, doc) {
		return Freezers.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Freezers.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Freezers.userCanRemove(userId, doc);
	}
});

Freezers.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Freezers.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Freezers.before.remove(function(userId, doc) {
	
});

Freezers.after.insert(function(userId, doc) {
	
});

Freezers.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Freezers.after.remove(function(userId, doc) {
	
});
