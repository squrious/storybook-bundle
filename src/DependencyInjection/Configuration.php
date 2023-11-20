<?php

namespace Storybook\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('storybook');
        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('server')
                    ->info('The URL of the Storybook server. Pass null to disable the CORS headers.')
                    ->defaultValue('http://localhost:6006')
                ->end()
            ->end();
        return $treeBuilder;
    }
}