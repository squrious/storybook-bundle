<?php

namespace Storybook\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Storybook\Twig\StoryNode;
use Storybook\Twig\StoryTokenParser;
use Twig\Environment;
use Twig\Loader\LoaderInterface;
use Twig\Node\Expression\ArrayExpression;
use Twig\Node\Expression\ConstantExpression;
use Twig\Node\Node;
use Twig\Node\TextNode;
use Twig\Parser;
use Twig\Source;

class StoryTokenParserTest extends TestCase
{
    /**
     * @dataProvider getTestsForStory
     */
    public function testParseStoryToken(string $source, Node $expected)
    {
        $twig = new Environment($this->createMock(LoaderInterface::class),  ['cache' => false, 'autoescape' => false, 'optimizations' => 0]);
        $twig->addTokenParser(new StoryTokenParser());

        $source = new Source($source, '');
        $stream = $twig->tokenize($source);
        $parser = new Parser($twig);

        $expected->setSourceContext($source);

        $parsed = $parser->parse($stream)->getNode('body')->getNode(0);
        $this->assertEquals($expected, $parsed);
    }

    public function getTestsForStory()
    {
        yield [
            '{% story Default %}<div></div>{% endstory %}',
            new StoryNode(
                new TextNode('<div></div>', 1),
                'Default',
                null,
                1,
                'story'
            )
        ];

        yield [
            '{% story Default with { args: {foo: "bar"} } %}<div></div>{% endstory %}',
            new StoryNode(
                new TextNode('<div></div>', 1),
                'Default',
                new ArrayExpression([
                    new ConstantExpression('args', 1),
                    new ArrayExpression([
                        new ConstantExpression('foo', 1),
                        new ConstantExpression('bar', 1),
                    ], 1)
                ], 1),
                1,
                'story'
            )
        ];
    }
}
