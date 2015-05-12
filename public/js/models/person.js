var Person = Backbone.Model.extend({
	
	url: "http://private-8a222-people15.apiary-mock.com/people/1",

	defaults: {
		name: '',
		title: '',
		location: '',
		email: '',
		phone: {
			work: '',
			home: '',
			cell: ''
		}
	},

	validate: function(attrs, options) {
		var errors = new Array();

		if ( ! attrs.name) {
			errors.push({ field: "name", msg: "Name cannot be empty" });
		}

		if ( ! attrs.title) {
			errors.push({ field: "title", msg: "Title cannot be empty" });
		}

		if ( ! attrs.location) {
			errors.push({ field: "location", msg: "Location cannot be empty" });
		}

		if ( ! attrs.email) {
			errors.push({ field: "email", msg: "Email cannot be empty" });
		} else if (attrs.email.match(/.+@[^@]+\.[^@]{2,}$/) == null) {
			errors.push({ field: "email", msg: "Invalid email format" });
		}

		if ( ! attrs.phone.work && ! attrs.phone.home && ! attrs.phone.cell) {
			errors.push({ field: "phone[work]", msg: "Must have one phone number available" });
		} else {
			if ( attrs.phone.work && ! attrs.phone.work.match(/^1?[\s-]*\(?\d{3}\)?[\s-]*\d{3}[\s-]*\d{4}$/)) {
				errors.push({ field: "phone[work]", msg: "Work phone is invalid format" });
			}
			if ( attrs.phone.home && ! attrs.phone.home.match(/^1?[\s-]*\(?\d{3}\)?[\s-]*\d{3}[\s-]*\d{4}$/)) {
				errors.push({ field: "phone[home]", msg: "Home phone is invalid format" });
			}
			if ( attrs.phone.cell && ! attrs.phone.cell.match(/^1?[\s-]*\(?\d{3}\)?[\s-]*\d{3}[\s-]*\d{4}$/)) {
				errors.push({ field: "phone[cell]", msg: "Cell phone is invalid format" });
			}
		}

		if (errors.length) {
			return errors;
		}

	},

});