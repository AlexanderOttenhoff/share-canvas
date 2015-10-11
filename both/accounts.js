AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');

AccountsTemplates.addFields([{
	_id: "username",
	type: "text",
	displayName: "username",
	required: true
}, {
	_id: 'password',
	type: 'password',
	required: true
}]);
