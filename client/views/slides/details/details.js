var pageSession = new ReactiveDict();

Template.SlidesDetails.rendered = function() {
	
};

Template.SlidesDetails.events({
	
});

Template.SlidesDetails.helpers({
	
});

Template.SlidesDetailsDetailsForm.rendered = function() {
	

	pageSession.set("slidesDetailsDetailsFormInfoMessage", "");
	pageSession.set("slidesDetailsDetailsFormErrorMessage", "");

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

Template.SlidesDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("slidesDetailsDetailsFormInfoMessage", "");
		pageSession.set("slidesDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var slidesDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(slidesDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("slidesDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("slidesDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("slides", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("slides", {});
	}

	
});

Template.SlidesDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("slidesDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("slidesDetailsDetailsFormErrorMessage");
	}
	
});
