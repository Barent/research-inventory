var pageSession = new ReactiveDict();

Template.Slides.rendered = function() {
	
};

Template.Slides.events({
	
});

Template.Slides.helpers({
	
});

var SlidesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("SlidesViewSearchString");
	var sortBy = pageSession.get("SlidesViewSortBy");
	var sortAscending = pageSession.get("SlidesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["SubjectId", "TissueId", "Tissue", "NumberOfSlides", "FreezerNumber", "ShelfNumber", "BoxNumber", "Slot", "age", "note"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var SlidesViewExport = function(cursor, fileType) {
	var data = SlidesViewItems(cursor);
	var exportFields = ["SubjectId", "TissueId", "Tissue", "NumberOfSlides", "FreezerNumber", "ShelfNumber", "BoxNumber", "Slot", "age", "note"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.SlidesView.rendered = function() {
	pageSession.set("SlidesViewStyle", "table");
	
};

Template.SlidesView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("SlidesViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("SlidesViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("SlidesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("slides.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		SlidesViewExport(this.slides, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		SlidesViewExport(this.slides, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		SlidesViewExport(this.slides, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		SlidesViewExport(this.slides, "json");
	}

	
});

Template.SlidesView.helpers({

	"insertButtonClass": function() {
		return Slides.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.slides || this.slides.count() == 0;
	},
	"isNotEmpty": function() {
		return this.slides && this.slides.count() > 0;
	},
	"isNotFound": function() {
		return this.slides && pageSession.get("SlidesViewSearchString") && SlidesViewItems(this.slides).length == 0;
	},
	"searchString": function() {
		return pageSession.get("SlidesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("SlidesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("SlidesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("SlidesViewStyle") == "gallery";
	}

	
});


Template.SlidesViewTable.rendered = function() {
	
};

Template.SlidesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("SlidesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("SlidesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("SlidesViewSortAscending") || false;
			pageSession.set("SlidesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("SlidesViewSortAscending", true);
		}
	}
});

Template.SlidesViewTable.helpers({
	"tableItems": function() {
		return SlidesViewItems(this.slides);
	}
});


Template.SlidesViewTableItems.rendered = function() {
	
};

Template.SlidesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		Router.go("slides.details", {SubjectId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Slides.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Slides.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("slides.edit", {SubjectId: this._id});
		return false;
	}
});

Template.SlidesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Slides.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Slides.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
