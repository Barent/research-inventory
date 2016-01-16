Meteor.publish("freezers", function() {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Freezers.find({}, {});
	}
	return Freezers.find({createdBy:this.userId}, {});
});

Meteor.publish("freezers_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Freezers.find({_id:null}, {});
	}
	return Freezers.find({_id:null,createdBy:this.userId}, {});
});

Meteor.publish("freezer", function(id) {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Freezers.find({_id:id}, {});
	}
	return Freezers.find({_id:id,createdBy:this.userId}, {});
});

