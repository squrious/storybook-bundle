<?php

namespace Storybook\Controller;

use Storybook\Exception\RenderException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

class StorybookController
{
    public function __construct(private readonly Environment $twig)
    {
    }

    public function __invoke(Request $request, string $id): Response
    {
        $template = '@Storybook/component.html.twig';

        $context = ['args' => $request->query->all(), 'id' => $id];

        try {
            $content = $this->twig->render($template, $context);
        } catch (\Throwable $th) {
            throw new RenderException('Unable to render story.', $th);
        }

        return new Response($content, Response::HTTP_OK);
    }
}
