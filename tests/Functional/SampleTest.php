<?php

namespace Storybook\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Twig\Environment;

class SampleTest extends KernelTestCase
{

    public function testSomething()
    {
        self::bootKernel();

        /**
         * @var Environment $twig
         */
        $twig = self::getContainer()->get('twig');

        $story = <<<HTML
        {% story Default %}foo{% endstory %}
        HTML;

        $storyTemplate = $twig->createTemplate($story);

        $storyTemplateName = $storyTemplate->getTemplateName();
        $main = <<<HTML
        {% extends ${storyTemplateName} %}
        {% block storybook %}
        {{ render_story('Default') }}
        {% endblock %}
        HTML;

        $mainTpl = $twig->createTemplate($main);


        $this->assertTrue(true);

    }
}
