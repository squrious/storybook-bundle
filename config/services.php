<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Storybook\Controller\StorybookController;
use Storybook\EventListener\CorsListener;
use Storybook\Loader\StorybookLoader;

return static function (ContainerConfigurator $container) {
  $container->services()
      ->set('storybook.controller.render_story', StorybookController::class)
        ->args([
            service('twig'),
            service('storybook.loader'),
        ])
        ->tag('controller.service_arguments')
    ->set('storybook.listener.cors', CorsListener::class)
        ->args([
            service('request_stack'),
            abstract_arg('storybook dev server host'),
        ])
        ->tag('kernel.event_listener')
    ->set('storybook.loader', StorybookLoader::class)
  ;
};