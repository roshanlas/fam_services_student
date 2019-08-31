const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <br/><br/Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ulabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ulabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ulabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ulabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ulabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ulabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";

const stories = [
    {
        person: 'Person 1',
        occupation: 'Occupation 1',
        title: 'Title 1',
        storyID: `0001`,
        description: description,
        questions: [
            { 
                title: 'What do you think of...?'
            },
            { 
                title: 'How do you think of...?'
            },
            { 
                title: 'Where do you think of...?'
            }
        ]
    }
]

for(let i = 1; i<31; i++) {
    stories.push({
        person: `Dr Stella Chinyelu Okoli`,
        occupation: `Pharmacist & Entrepreneur`,
        title: `Entreprenuership and Manufacturing`,
        storyID: `000${i}`,
        description: description,
        questions: [
            { 
                title: 'What do you think of...?'
            },
            { 
                title: 'How do you think of...?'
            },
            { 
                title: 'Where do you think of...?'
            }
        ]
    });
}


module.exports = stories;