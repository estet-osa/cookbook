<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Recipe;
use AppBundle\Entity\Ingredients;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Form\RecipeType;
use AppBundle\Form\IngredientsType;


class IngredientsController extends Controller
{
    /**
     * @Route("/ingredients/list", name="ingredient_list")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $list = $em->getRepository('AppBundle:Recipe')->findAll();

        return $this->render('AppBundle:Ingredients:list.html.twig', [
            'recipes' => $list
        ]);
    }

    /**
     * @Route("/ingredients/new", name="newIngredient")
     */
    public function newAction(Request $request)
    {
        $ingredient = new Ingredients();
        $form = $this->createForm(IngredientsType::class, $ingredient);
        $form->handleRequest($request);
        $em = $this->getDoctrine()->getManager();

        if ($form->isSubmitted() && $form->isValid()){

            $ingredient = $form->getData();
            $em->persist($ingredient);
            $em->flush();

            return $this->redirect('/');
        }

        return $this->render('AppBundle:Ingredients:new.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * @Route("/ingredients/show/{cookbookId}", name="show$Ingredient")
     */
    public function showAction($cookbookId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($cookbookId);

        return $this->render('AppBundle:Ingredients:show.html.twig', [
            'recipe' => $recipe
        ]);
    }

    /**
     * @Route("/ingredients/edit/{ingredientId}", name="editIngredient")
     */
    public function editAction($ingredientId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('AppBundle:Recipe')->find($ingredientId);
        $form = $this->createForm(RecipeType::class, $user);
        $successFormEditable = false;

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $data = $form->getData();
            $em->persist($data);
            $em->flush();

            return $this->redirect('/show/' . $ingredientId);
        }

        return $this->render('AppBundle:Ingredients:edit.html.twig', [
            'form'    => $form->createView(),
            'success' => $successFormEditable,
        ]);
    }
}
