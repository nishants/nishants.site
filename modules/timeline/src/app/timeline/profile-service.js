angular.module("timeline").service("ProfileService", [function () {

	return {
		timeline: {
			positions: [
				{
					title: 'Technical Consultant',
					organisation: 'Freelance',
					description: 'Worked in different roles independently.',
					period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
					tags    : ["team leadership", "leadership", "freelance","coaching", "open source"],
					projects : [
						{
							title: 'Mphasis',
							description: 'Technical Coach',
							tech : ["ruby", "selenium", "jenkins"],
							tags : ["automation", "acceptance test", "atdd", "tdd", "bdd", "agile", "agile coach", "consulting", "scrum"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						},
						{
							title: 'Agility Roots',
							description: 'Consultint Partner',
							tags : ["sales", "recruitment", "interview", "consulting", "automation", "acceptance test", "atdd", "tdd", "bdd", "agile", "agile coach", "consulting", "scrum"],
							tech : ["java", "angular", "ruby"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						},
						{
							title: 'UI/UX Consultant',
							description: 'TookiTaki',
							tech : ["angularjs", "ruby", "angular", "facebook ads api", "scss"],
							tags : ["ux", "ui", "ui development", "frontend", "freelance","consulting", "design","ads" ,"online marketing"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						}

					]
				},

				{
					title: 'Technical Consultant',
					description: 'Worked with some great cross functional teams.',
					organisation: 'ThoughtWorks',
					tags : ["consulting", "mentoring", "evolutionary design", "test driven development", "tdd"],
					period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
					projects : [
						{
							title: 'Caterpillar',
							description: 'Position',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						},
						{
							title: 'Health Care At Home',
							description: 'Position',
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
							tags : []
						},
						{
							title: 'UNICEF Uganda',
							description: 'Position',
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
							tags : []
						}

					]
				}

			]
		},
	};
}]);


