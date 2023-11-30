<?php

namespace Storybook\Tests\Integration;

use PHPUnit\Framework\TestCase;
use Storybook\Twig\StoryTokenParser;
use Twig\Environment;
use Twig\Loader\LoaderInterface;

class RenderStoryTest extends TestCase
{
    private const STORY = <<<HTML
    {% story Default %}
    <div>Sample</div>
    {% endstory %}
    HTML;


    /**
     * @dataProvider getStoryForRender
     */
    public function testRenderStory(string $template, string $name, string $expected)
    {
        $env = new Environment($this->createMock(LoaderInterface::class), []);
        $env->addTokenParser(new StoryTokenParser());

        $view = $env->createTemplate($template)->render(['__story' => $name]);

        $this->assertEquals($expected, $view);
    }

    public function getStoryForRender(): iterable
    {
        yield [self::STORY, 'Default', "<div>Sample</div>\n"];
    }
}
