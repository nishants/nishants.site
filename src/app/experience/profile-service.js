angular.module("timeline").service("ProfileService", [function () {

	return {
		timeline: {
			positions: [
				{
					title: 'Technical Consultant',
					organisation: 'Freelancer',
					description: 'Worked in different roles independently.',
					logo : "public/images/profile.jpg",
					period  : {from: {year: 2015, month: "June"}},
					tags    : ["team leadership", "leadership", "freelance","coaching", "open source"],
					projects : [
						{
							title: 'Mphasis Bangalore',
							logo : "public/images/logos/mphasis.jpg",
							description: 'Coaching and consulting for introducing Acceptance Test Driven Development for a specific account.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2016, month: "May"}, to: {year: 2016, month: "Jan"}},
						},
						{
							title: 'Agility Roots',
							logo : "public/images/logos/agilityroots.png",
							description: 'Worked independently with client evangelizing Acceptance Test Driven Development.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2016, month: "Feb"}}
						},
						{
							title: 'TookiTaki',
							logo : "public/images/logos/tookitaki.png",
							description: 'UX/UI improvement for online ad management platform.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2015, month: "July"}, to: {year: 2015, month: "Dec"}},
						},

					]
				},

				{
					title: 'Technical Coach',
					description: 'Worked with some great cross functional teams.',
					organisation: 'Xebia',
					color: "#6c1d5f",
					logo : "public/images/logos/xebia.png",
					tags : ["consulting", "mentoring", "evolutionary design", "test driven development", "tdd"],
					period  : {from: {year: 2014, month: "Oct"}, to: {year: 2015, month: "June"}},
					projects : [
						{
							title: 'Societe Generale Bangalore',
							logo : "public/images/logos/sg.png",
							description: 'Coaching teams on programming practices, like test driven development, refactoring, testing strategy.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2014, month: "Nov"}, to: {year: 2015, month: "June"}},
						}]
				},

				{
					title: 'Technical Consultant',
					description: 'Worked with some great cross functional teams.',
					organisation: 'ThoughtWorks',
					color: "#1bbed0",
					logo : "public/images/logos/tw.png",
					tags : ["consulting", "mentoring", "evolutionary design", "test driven development", "tdd"],
					period  : {from: {year: 2012, month: "Nov"}, to: {year: 2014, month: "Oct"}},
					projects : [
						{
							title: 'Caterpillar',
							logo : "public/images/logos/caterpillar.jpeg",
							description: 'Single-platform to manage parts sales commercials, across their global distribution network of dealers.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2012, month: "Sep"}, to: {year: "2014", month: "Oct"}},
						},
						{
							title: 'Health Care At Home',
							logo : "public/images/logos/hcah.jpg",
							description: 'Mobile webapp for a Delhi based health startup. App helped nurses to collect data and generate reports on patients.',
							period  : {from: {year: 2012, month: "April"}, to: {year: 2012, month: "Sep"}},
							tags : []
						},
						{
							title: 'UNICEF Uganda',
							logo : "public/images/logos/unicef.jpeg",
							description: 'System Integration(MTrack with DHIS2), and consolidating data on health care providers throughout the country.',
							period  : {from: {year: 2011, month: "Dec"}, to: {year: 2012, month: "April"}},
							tags : []
						}

					]
				},
				{
					title: 'Application Developer',
					description: '',
					organisation: 'Oracle',
					color: "#f80000",
					logo : "public/images/logos/oracle.png",
					tags : [],
					period  : {from: {year: 2012, month: "June"}, to: {year: 2012, month: "Nov"}},
					projects : [
						{
							title: 'Flexcube Core Development Team',
							logo : "public/images/logos/flexcube.jpeg",
							description: "Worked in the core development team of Oracle's banking platform",
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2012, month: "June"}, to: {year: 2012, month: "Nov"}},
						}
					]
				},
				{
					title: 'System Engineer',
					description: '',
					organisation: 'Infosys',
					color: "#017cc3",
					logo : "public/images/logos/infosys.png",
					tags : [],
					period  : {from: {year: 2010, month: "Aug"}, to: {year: 2012, month: "May"}},
					projects : [
						{
							title: 'Archive and Purge Automation',
							logo : "public/images/logos/automate.png",
							description: "Wrote a java tool to automate my teams daily workflow. Later rewrote it in PL/SQL. It was adopted by Team as the official tool.",
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2014, month: "Nov"}, to: {year: 2015, month: "June"}},
						},
						{
							title: 'Support Engineer',
							logo : "public/images/logos/oracledb.png",
							description: 'Support for oracle apps backend for Arrow.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2010, month: "Aug"}, to: {year: 2012, month: "June"}},
						}
					]
				}
			]
		},
	};
}]);


