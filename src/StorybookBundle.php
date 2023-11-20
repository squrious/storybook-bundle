<?php

namespace Storybook;

use Storybook\DependencyInjection\StorybookExtension;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class StorybookBundle extends Bundle
{
    public function getContainerExtension(): ?ExtensionInterface
    {
        return new StorybookExtension();
    }

    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
}
