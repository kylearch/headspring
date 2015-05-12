var editModal = Backbone.View.extend({

	className: "modal fade",

	events: {
		'hidden': 'remove',

		'click .js-delete': 'deletePerson',
		'click .js-save': 'saveChanges',
	},

	initialize: function(model) {
		this.model = model;
		_.bindAll(this, 'deleteSuccess', 'deleteError', 'closeModal');

		this.model.on("invalid", this.invalid);

		this.render();
	},

	render: function() {
		var tpl = _.template($("#modalTemplate").html());
		var data = this.model.toJSON(),
			content = tpl(data);
		this.$el.html(content);
		this.$el.modal('show');
	},


	deletePerson: function(e) {
		e.preventDefault();
		this.$el.find(".js-delete").html("<i class='fa fa-cog fa-spin'></i> Working...");
		this.model.destroy({
			success: this.deleteSuccess,
			error: this.deleteError,
		});
	},

	deleteSuccess: function() {
		this.closeModal();
	},

	deleteError: function() {
		this.$el.find(".js-delete").html("Delete " + this.model.get("name"));
	},

	saveChanges: function(e) {
		var data = Backbone.Syphon.serialize(this),
			isNew = this.model.isNew(),
			self = this;
		$(".modal").find(".form-group").removeClass("has-error");
		$(".help-block").remove();
		$(e.currentTarget).html("<i class='fa fa-cog fa-spin'></i> Working...");
		this.model.save(data, {
			success: function(model) {
				if (isNew) {
					self.addRow(model);
				}
				self.closeModal();
			},
			error: this.saveError,
		});
	},

	closeModal: function(model) {
		this.$el.modal('hide');
	},

	saveError: function(error) {
		// add some handling to errors like server being unreachable, etc
		console.error(error);
	},

	invalid: function(model, errors, view) {
		$(".js-save").html("Save changes");
		for (var i = 0; i < errors.length; i++) {
			var error = errors[i],
				formGroup = $("input[id='" + error.field + "']").parents(".form-group");
			formGroup.addClass("has-error");
			formGroup.append('<span class="help-block">' + error.msg + '</span>');
		}
	},

	addRow: function(model) {
		var tpl = _.template($("#rowTemplate").html()),
			html = tpl(model.toJSON());
		// There would need to be additional logic here to determine whether the new row should be appended to the current page (unlikely), 
		// or (if desired) the user should be taken to the page that this new user is on (alphabetically or otherwise).
		// For the sake of this example, the row is appended to the bottom
		$("#directory tbody").append(html);
	}

});