var pageSession = new ReactiveDict();

Template.Freezers.rendered = function() {
	
};

Template.Freezers.events({
	
});

Template.Freezers.helpers({
	
});

var FreezersViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("FreezersViewSearchString");
	var sortBy = pageSession.get("FreezersViewSortBy");
	var sortAscending = pageSession.get("FreezersViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["id", "locationnum", "animalid", "barcode", "dayofcollection", "project", "group", "sex", "samplegroup", "item", "quantity", "comments"];
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

var FreezersViewExport = function(cursor, fileType) {
	var data = FreezersViewItems(cursor);
	var exportFields = ["id", "locationnum", "animalid", "barcode", "dayofcollection", "project", "group", "sex", "samplegroup", "item", "quantity", "comments"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.FreezersView.rendered = function() {
	pageSession.set("FreezersViewStyle", "table");
	
};

Template.FreezersView.events({
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
				pageSession.set("FreezersViewSearchString", searchString);
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
					pageSession.set("FreezersViewSearchString", searchString);
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
					pageSession.set("FreezersViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("freezers.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		FreezersViewExport(this.freezers, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		FreezersViewExport(this.freezers, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		FreezersViewExport(this.freezers, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		FreezersViewExport(this.freezers, "json");
	}

	
});

Template.FreezersView.helpers({

	"insertButtonClass": function() {
		return Freezers.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.freezers || this.freezers.count() == 0;
	},
	"isNotEmpty": function() {
		return this.freezers && this.freezers.count() > 0;
	},
	"isNotFound": function() {
		return this.freezers && pageSession.get("FreezersViewSearchString") && FreezersViewItems(this.freezers).length == 0;
	},
	"searchString": function() {
		return pageSession.get("FreezersViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("FreezersViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("FreezersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("FreezersViewStyle") == "gallery";
	}

	
});


Template.FreezersViewTable.rendered = function() {
	
};

Template.FreezersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("FreezersViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("FreezersViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("FreezersViewSortAscending") || false;
			pageSession.set("FreezersViewSortAscending", !sortAscending);
		} else {
			pageSession.set("FreezersViewSortAscending", true);
		}
	}
});

Template.FreezersViewTable.helpers({
	"tableItems": function() {
		return FreezersViewItems(this.freezers);
	}
});


Template.FreezersViewTableItems.rendered = function() {
	
};

Template.FreezersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		Router.go("freezers.details", {id: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Freezers.update({ _id: this._id }, { $set: values });

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
						Freezers.remove({ _id: me._id });
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
		Router.go("freezers.edit", {id: this._id});
		return false;
	}
});

Template.FreezersViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Freezers.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Freezers.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
