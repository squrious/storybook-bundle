<?php

namespace Storybook\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Storybook\Twig\StoryNode;
use Twig\Compiler;
use Twig\Environment;
use Twig\Loader\LoaderInterface;
use Twig\Node\Node;
use Twig\Node\TextNode;

class StoryNodeTest extends TestCase
{
    /**
     * @dataProvider getTestsForCompile
     */
    public function testCompile(Node $node, string $expected)
    {
        $env = new Environment($this->createMock(LoaderInterface::class), []);
        $compiler = new Compiler($env);

        $compiled = $compiler->compile($node)->getSource();

        $this->assertEquals($expected, $compiled);
    }

    public function getTestsForCompile()
    {
        yield [
            $this->createStoryNode('<div></div>', 'Default'),
            <<<PHP
            if (\$context['__story'] === 'Default') {
                echo "<div></div>";
            }
            
            PHP
        ];
    }

    private function createStoryNode(string $template, string $name) {
        return new StoryNode(
            new TextNode($template, 0),
            $name,
            null,
            0
        );
    }
}