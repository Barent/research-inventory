var pageSession = new ReactiveDict();

Template.SlidesEdit.rendered = function() {
	
};

Template.SlidesEdit.events({
	
});

Template.SlidesEdit.helpers({
	
});

Template.SlidesEditEditForm.rendered = function() {
	

	pageSession.set("slidesEditEditFormInfoMessage", "");
	pageSession.set("slidesEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.SlidesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("slidesEditEditFormInfoMessage", "");
		pageSession.set("slidesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var slidesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(slidesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("slidesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("slides", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("slidesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Slides.update({ _id: t.data.slide._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("slides", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.SlidesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("slidesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("slidesEditEditFormErrorMessage");
	}
	
});
