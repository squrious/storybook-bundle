function lexContent(story) {
    let position = 0;
    let output = {};

    while (position < story.length) {
        if (consume('{%', position, story) > 0) {
            position += 2;

            let endPosition = consumeEndBlock(position, story);
            let blockContent = story.substring(position, endPosition);
            let block = blockContent.trim().split(/\s+/);
            let blockName = block[0];

            block.shift();
            let blockArgs = block.join(' ');

            switch (blockName) {
                case 'args':
                    lexArgs(blockArgs, output);
                    break;
                case 'argTypes':
                    lexArgsType(blockArgs, output);
                    break;
                case 'story':
                    lexStory(blockArgs, output);
                    consumeStoryContent(position, story);
                    break;
            }
        }

        position++;
    }

    return output;
}

function consume(string, position, story) {
    if (story.substring(position, position + string.length) === string) {

        return true;
    }

    return false;
}

function consumeEndBlock(position, story) {
    while (position < story.length) {
        if (consume('%}', position, story) > 0) {
            return position;
        }

        position++;
    }

    throw new Error('Missing end block');
}

function lexArgs(blockArgs, output) {
    if (output.args === undefined) {
        output.args = {};
    }

    blockArgs.split(',').forEach(arg => {
        let splitedArg = arg.split('=');

        if (splitedArg.length === 1) {
            output.args[splitedArg[0]] = '';

            return;
        }

        output.args[splitedArg[0].trim()] = JSON.parse(splitedArg[1].trim());
    })
}

function lexArgsType(blockArgs, output) {
    if (output.argType === undefined) {
        output.argType = {};
    }

    blockArgs.split(',').forEach(arg => {
        let splitedArg = arg.split('=');

        if (splitedArg.length === 1) {
            throw new Error('Argtype must be defined with a type');
        }

        output.argType[splitedArg[0].trim()] = JSON.parse(splitedArg[1]);
    })
}

function lexStory(blockStory, output) {
    if (output.stories === undefined) {
        output.stories = [];
    }

    let story = {};
    let splited = blockStory.split('with');

    story.name = splited[0].trim();
    story.args = JSON.parse(splited[1]);

    output.stories.push(story);
}

function consumeStoryContent(position, story) {
    while (position < story.length) {
        if (consume('{% endstory %}', position, story) > 0) {
            return;
        }

        position++;
    }
}

module.exports = { lexContent };

