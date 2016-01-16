var pageSession = new ReactiveDict();

Template.FreezersDetails.rendered = function() {
	
};

Template.FreezersDetails.events({
	
});

Template.FreezersDetails.helpers({
	
});

Template.FreezersDetailsDetailsForm.rendered = function() {
	

	pageSession.set("freezersDetailsDetailsFormInfoMessage", "");
	pageSession.set("freezersDetailsDetailsFormErrorMessage", "");

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

Template.FreezersDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("freezersDetailsDetailsFormInfoMessage", "");
		pageSession.set("freezersDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var freezersDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(freezersDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("freezersDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("freezersDetailsDetailsFormErrorMessage", message);
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

		Router.go("freezers", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("freezers", {});
	}

	
});

Template.FreezersDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("freezersDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("freezersDetailsDetailsFormErrorMessage");
	}
	
});
