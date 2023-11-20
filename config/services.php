<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Storybook\Controller\StorybookController;
use Storybook\EventListener\CorsListener;

return static function (ContainerConfigurator $container) {
  $container->services()
      ->set('storybook.controller.render', StorybookController::class)
        ->args([
            service('twig'),
        ])
        ->tag('controller.service_arguments')
    ->set('storybook.listener.cors', CorsListener::class)
        ->args([
            service('request_stack'),
            param('storybook.server'),
        ])
        ->tag('kernel.event_listener')
  ;
};