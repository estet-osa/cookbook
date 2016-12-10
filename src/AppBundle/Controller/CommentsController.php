<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Comments;
use AppBundle\Form\CommentsType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CommentsController
 * @package AppBundle\Controller
 */
class CommentsController extends Controller
{
    /**
     * @Route("/comment/add", name="comment_add")
     * @Method("POST")
     */
    public function newAction(Request $request)
    {
        $referer    = explode('/', $request->headers->get('referer'));
        $recipeId   = $referer[4] ?? false;

        $em     = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($recipeId);
        $comment = new Comments();

        $form = $this->createForm(CommentsType::class, $comment);
        $form->handleRequest($request);

        if(!$recipe)
            throw $this->createNotFoundException('No recipe found for id ' . $recipe);
        else{

            if(!$form->isSubmitted() && !$form->isValid())
                return new Response('error form');
            else{

                // Get data from form
                $data = $form->getData();

                $text = $data->getDescription();

                if(strlen($text) >= 5){
                    $comment->setDescription($text);
                    $comment->setRecipe($recipe);

                    $em->persist($comment);
                    $em->flush();

                    return new Response('comment ok');

                }else
                    return new JsonResponse(['error' => 'length']);
            }
        }
    }
}
