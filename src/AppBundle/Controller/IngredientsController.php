<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Ingredients;
use Doctrine\ORM\Query\ResultSetMapping;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Form\IngredientsType;

/**
 * Class IngredientsController
 * @package AppBundle\Controller
 */
class IngredientsController extends Controller
{
    /**
     * @Route("/ingredient/add", name="newIngredient")
     */
    public function newAction(Request $request)
    {
        $newValue   = $request->request->get('data');
        $referer    = explode('/', $request->headers->get('referer'));
        $recipeId   = $referer[4] ?? false;

        $em     = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($recipeId);

        if(!$recipe)
            throw $this->createNotFoundException('No recipe found for id ' . $recipe);
        else{

            $ingredient = new Ingredients();

            if($recipe){

                $ingredient->setTitle($newValue);
                $ingredient->setRecipe($recipe);

                $em->persist($ingredient);
                $em->flush();
            }

            return new Response('ok');
        }
    }

    /**
     * @route("/ingredients/jornal")
     */
    public function showAction(Request $request)
    {
        $data = $request->request->get('data');
        $json = json_decode($data);
        $ids  = implode(',', $json->ids);

        $em  = $this->getDoctrine()->getManager();
        $sql = "SELECT title, count(title) as cnt FROM ingredients
                WHERE recipe_id IN ({$ids})
                GROUP BY title";

        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('title', 'title');
        $rsm->addScalarResult('cnt', 'cnt');
        $query = $em->createNativeQuery($sql, $rsm);
        $recipe = $query->getResult();

        return new JsonResponse($recipe);
    }
}
