Slides.allow({
	insert: function (userId, doc) {
		return Slides.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Slides.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Slides.userCanRemove(userId, doc);
	}
});

Slides.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Slides.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Slides.before.remove(function(userId, doc) {
	
});

Slides.after.insert(function(userId, doc) {
	
});

Slides.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Slides.after.remove(function(userId, doc) {
	
});
