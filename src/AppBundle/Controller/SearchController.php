<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CommentsController
 * @package AppBundle\Controller
 */
class SearchController extends Controller
{
    /**
     * @Route("/search/{findStr}", name="search")
     */
    public function newAction($findStr, Request $request)
    {

        return new Response('search ok');
    }
}
