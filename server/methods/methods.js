Meteor.methods({

"deleteAllMySlides": function (){
	var me = Meteor.userId();
	Slides.remove({ createdBy: me });
},
"deleteAllMyFreezers": function (){
	var me = Meteor.userId();
	Freezers.remove({ createdBy: me });
}


});
