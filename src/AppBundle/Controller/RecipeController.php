<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class RecipeController
 * @package AppBundle\Controller
 */
class RecipeController extends Controller
{
    /**
     * @Route("/recipe/upload", name="recipe_upload")
     */
    public function newAction(Request $request)
    {


        return new Response('хмм, мы тут');
    }
}
