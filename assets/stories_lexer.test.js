const lexer = require('./stories_lexer');

test('adds 1 + 2 to equal 3', () => {
    let output = lexer.lexContent(`
        {% args label = "Click me" %}
        {% argTypes label = {"control": "text"} %}
        
        {% story Default with {"label": "Default"} %}
            <button>{{ label }}</button>
        {% endstory %}
    `)

    expect(JSON.stringify(output)).toBe(JSON.stringify({
        args: {label: 'Click me'},
        argType: {label: {control: 'text'}},
        stories: [
            {
                name: 'Default',
                args: {
                    label: 'Default'
                }
            }
        ]
    }));
});