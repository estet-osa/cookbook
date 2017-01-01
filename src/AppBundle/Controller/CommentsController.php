<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Comments;
use AppBundle\Entity\CommentsVote;
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

    /**
     * @Route("/comment/vote", name="comment_vote")
     * @Method("POST")
     */
    public function commentVote(Request $request)
    {
        $data       = $request->request->get('data');
        $json       = json_decode($data);
        $commentId  = $json->id;

        if ($json->action != 'down')
            $userVote = ($json->vote == 'like') ? 1 : 2;
        else
            $userVote = 0;

        //Set the client id from hash user agent & user ip
        $clientId = substr(md5($request->getClientIp(true)), 0, 10);

        $referer = explode('/', $request->headers->get('referer'));
        $recipeId  = $referer[4] ?? false;

        $em      = $this->getDoctrine()->getManager();
        $comment = $em->getRepository('AppBundle:Comments')->find($commentId);
        $vote    = $em->getRepository('AppBundle:CommentsVote')->findOneBy([
            'client_id' => $clientId,
            'entry'     => $commentId
        ]);

        if($vote){

            $vote->setUserVote(1);
            $vote->setClientId($clientId);
            $vote->setUserVote($userVote);
            $vote->setEntry($comment);

            $em->persist($vote);
            $em->flush();

        }else{

            $newVote = new CommentsVote();
            $newVote->setUserVote($userVote);
            $newVote->setClientId($clientId);
            $newVote->setEntry($comment);

            $em->persist($newVote);
            $em->flush();
        }

        return new Response('vote ok');
    }
}
