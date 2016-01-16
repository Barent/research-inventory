var pageSession = new ReactiveDict();

Template.SlidesInsert.rendered = function() {
	
};

Template.SlidesInsert.events({
	
});

Template.SlidesInsert.helpers({
	
});

Template.SlidesInsertInsertForm.rendered = function() {
	

	pageSession.set("slidesInsertInsertFormInfoMessage", "");
	pageSession.set("slidesInsertInsertFormErrorMessage", "");

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

Template.SlidesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("slidesInsertInsertFormInfoMessage", "");
		pageSession.set("slidesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var slidesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(slidesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("slidesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("slides", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("slidesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Slides.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.SlidesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("slidesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("slidesInsertInsertFormErrorMessage");
	}
	
});
