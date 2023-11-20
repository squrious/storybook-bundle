<?php

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes) {
    $routes->add('storybook_render', '/component/{id}')
        ->requirements([
            'id' => '.+',
        ])
        ->controller('storybook.controller.render')
    ;
};
