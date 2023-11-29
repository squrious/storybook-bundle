<?php

namespace Storybook\Loader;

use Symfony\Component\HttpFoundation\Request;

class StorybookLoader
{
    private array $loaders = [];

    public function addLoader(string $name, callable $loader): void
    {
        if (!isset($this->loaders[$name])) {
            $this->loaders[$name] = [];
        }

        $this->loaders[$name][] = $loader;
    }

    public function load(string $name, Request $request): array
    {
        $data = $request->query->all();

        foreach ($this->loaders[$name] ?? [] as $loader) {
            if (!\is_callable($loader)) {
                throw new \LogicException('Loader must be callable');
            }

            $data = \array_merge($data, $loader());
        }

        return $data;
    }
}