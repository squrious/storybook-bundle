<?php

namespace Storybook\Controller;

use Storybook\Exception\RenderException;
use Storybook\Loader\StorybookLoader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

class StorybookController
{
    public function __construct(private readonly Environment $twig, private readonly StorybookLoader $loader)
    {
    }

    public function __invoke(Request $request, string $id): Response
    {
        $data = $this->loader->load($id, $request);

        try {
            $content = $this->twig->createTemplate('<div>This is a placeholder!</div>')->render(['args' => $data]);
        } catch (\Throwable $th) {
            throw new RenderException('Unable to render story.', $th);
        }

        return new Response($content);
    }
}
