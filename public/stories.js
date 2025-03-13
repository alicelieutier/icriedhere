async function fetchStories() {
    const storiesList = document.getElementById('stories-list');
    try {
        console.log('Fetching stories');
        const response = await fetch('/api/stories');
        const stories = await response.json();
        window.stories = stories;
        if (stories.length === 0) {
            storiesList.innerHTML = 'No stories available';
            return;
        }
        storiesList.innerHTML = '';
        stories.forEach(story => {
            const storyElement = document.createElement('div');
            storyElement.classList.add('story');
            storyElement.innerHTML = `
                <p>${story.story}</p>
                <div class="story-details">${story.details}</div>
            `;
            storiesList.appendChild(storyElement);
        });

    } catch (error) {
        storiesList.innerHTML = 'Error retrieving stories';
        console.error('Error retrieving stories:', error);
    }
}

async function submitStory(event) {
    event.preventDefault();
    const storyForm = document.getElementById('story-form');
    const story = document.getElementById('story').value;
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    try {
        const response = await fetch('/api/stories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ story, name, age, email })
        });
        const result = await response.json();
        if (response.ok) {
            const cachedFormHTML = storyForm.innerHTML;
            storyForm.innerHTML = '<p>Thank you for submitting your story! Once I have reviewed it it will be posted here.<p>';
            setTimeout(() => {
                storyForm.innerHTML = cachedFormHTML;
                storyForm.reset();
            }
            , 5000);
        } else {
            console.error('Error submitting story:', result.error);
            storyForm.innerHTML = '<p>There was an error submitting your story. Please try again later.<p>';
        }
    } catch (error) {
        console.error('Error submitting story:', error);
        storyForm.innerHTML = '<p>There was an error submitting your story. Please try again later.<p>';
    }
}

if (document.readyState !== 'loading') init()
else document.addEventListener('DOMContentLoaded', init);

function init() {
    fetchStories();
    document.getElementById('story-form').addEventListener('submit', submitStory);
}

