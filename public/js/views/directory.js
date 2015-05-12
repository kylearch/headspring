var Directory = Backbone.View.extend({

	el: $("body"),

	templates: {
		row: _.template($("#rowTemplate").html()),
		undo: _.template($("#undoTemplate").html()),

	},

	events: {
		'click .js-new': 'newPerson',

		'click .js-edit': 'editModal',
		'click .js-undo': 'undo',

		'click .js-page': 'changePage',
	},

	initialize: function() {
		this.collection = new People();
		this.collection.fetch();

		_.bindAll(this, 'renderRows', 'peopleSynced');

		this.listenToOnce(this.collection, "sync", this.peopleSynced);
		this.listenTo(this.collection, "change", this.updatePerson);
		this.listenTo(this.collection, "create", this.addPerson);
		this.listenTo(this.collection, "remove", this.removePerson);

		this.undoObj = new Array();
	},

	peopleSynced: function(people) {
		$("#js-loading").fadeOut(this.renderRows);
	},

	renderRows: function() {
		_.each(this.collection.models, function(person) {
			var tpl = _.template($("#rowTemplate").html()),
				row = tpl(person.toJSON());
			$("#directory tbody").append(row);
		});
		$('[data-toggle="tooltip"]').tooltip();
	},

	editModal: function(e) {
		e.preventDefault();
		var id = $(e.currentTarget).data("id"),
			model = this.collection.get(id);
			modal = new editModal(model);
	},

	updatePerson: function(model) {
		var tpl = _.template($("#rowTemplate").html()),
			row = $("#directory tr[data-id=" + model.get("id") + "]"),
			html = this.templates.row(model.toJSON());
		this.animateRow(row, html);
	},

	addPerson: function(undoObj) {
		var tpl = _.template($("#rowTemplate").html()),
			row = $("#directory tr[data-id=" + undoObj.model.get("id") + "]"),
			html = this.templates.row(undoObj.model.toJSON());
		this.animateRow(row, html);
	},

	removePerson: function(model, collection, options) {
		var row = $("tr[data-id=" + model.get("id") + "]"),
			html = this.templates.undo(model.toJSON());
		this.animateRow(row, html);

		this.undoObj[model.get("id")] = {
			action: "remove",
			reverse: "add",
			model: model,
			index: options.index,
		};
	},

	undo: function(e) {
		e.preventDefault();
		var id = $(e.currentTarget).data("id");
		this.collection.create(this.undoObj[id].model, { at: this.undoObj[id].index });
		this.collection.trigger("create", this.undoObj[id] );
	},

	animateRow: function(row, html) {
		row.animate({ opacity: 0 }, function() {
			row.replaceWith(html).animate({ opacity: 1 });
		});
	},

	changePage: function(e) {
		e.preventDefault();
		var body = $("#directory tbody");
		$(".js-pagination li").removeClass("active");
		$(e.currentTarget).parent("li").addClass("active");
		body.animate({ opacity: 0 }, function() {
			//Simulate Request API at specific page
			setTimeout(function() {
				body.animate({ opacity: 1 });
			}, 300);
		});
	},

	newPerson: function(e) {
		e.preventDefault();
		var model = new Person(),
			modal = new editModal(model);
	}

});

new Directory();