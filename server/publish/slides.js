Meteor.publish("slides", function() {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Slides.find({}, {});
	}
	return Slides.find({createdBy:this.userId}, {});
});

Meteor.publish("slides_empty", function() {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Slides.find({_id:null}, {});
	}
	return Slides.find({_id:null,createdBy:this.userId}, {});
});

Meteor.publish("slide", function(SubjectId) {
	if(Users.isInRoles(this.userId, ["admin","manager"])) {
		return Slides.find({_id:SubjectId}, {});
	}
	return Slides.find({_id:SubjectId,createdBy:this.userId}, {});
});

