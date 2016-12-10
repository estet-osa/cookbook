<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Cook;
use AppBundle\Form\CookType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CookController
 * @package AppBundle\Controller
 */
class CookController extends Controller
{
    /**
     * @Route("/cook/{cookId}", name="cook")
     */
    public function showAction($cookId, Request $request)
    {
        echo $currUser = $this->getUser()->getId();
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('AppBundle:Cook')->find($currUser);

        if(!$user){


            $user = new Cook();
            $user->setId($currUser);

        }

        $form = $this->createForm(CookType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $data = $form->getData();

            $em->persist($data);
            $em->flush();

        }


        return $this->render('AppBundle:Cook:info.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/cook/{cookId}/recipes", name="cook_recipes")
     */
    public function recipesAction(Request $request)
    {




        return $this->render('AppBundle:Cook:recipes.html.twig', [

        ]);
    }
}
