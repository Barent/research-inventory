var pageSession = new ReactiveDict();

Template.FreezersEdit.rendered = function() {
	
};

Template.FreezersEdit.events({
	
});

Template.FreezersEdit.helpers({
	
});

Template.FreezersEditEditForm.rendered = function() {
	

	pageSession.set("freezersEditEditFormInfoMessage", "");
	pageSession.set("freezersEditEditFormErrorMessage", "");

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

Template.FreezersEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("freezersEditEditFormInfoMessage", "");
		pageSession.set("freezersEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var freezersEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(freezersEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("freezersEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("freezers", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("freezersEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Freezers.update({ _id: t.data.freezer._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("freezers", {});
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

Template.FreezersEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("freezersEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("freezersEditEditFormErrorMessage");
	}
	
});
