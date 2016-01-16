var pageSession = new ReactiveDict();

Template.FreezersInsert.rendered = function() {
	
};

Template.FreezersInsert.events({
	
});

Template.FreezersInsert.helpers({
	
});

Template.FreezersInsertInsertForm.rendered = function() {
	

	pageSession.set("freezersInsertInsertFormInfoMessage", "");
	pageSession.set("freezersInsertInsertFormErrorMessage", "");

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

Template.FreezersInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("freezersInsertInsertFormInfoMessage", "");
		pageSession.set("freezersInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var freezersInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(freezersInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("freezersInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("freezers", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("freezersInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Freezers.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.FreezersInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("freezersInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("freezersInsertInsertFormErrorMessage");
	}
	
});
