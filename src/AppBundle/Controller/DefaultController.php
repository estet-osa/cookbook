<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Ingredients;
use AppBundle\Entity\Recipe;
use Doctrine\ORM\Query\ResultSetMapping;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Form\RecipeType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Ivory\CKEditorBundle\Form\Type\CKEditorType;
use AppBundle\Form\IngredientsType;

/**
 * Class DefaultController
 * @package AppBundle\Controller
 */
class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $list = $em->getRepository('AppBundle:Recipe')->findBy([
            'is_active' => true
        ]);

        return $this->render('AppBundle:Cookbook:list.html.twig', [
            'recipes' => $list
        ]);
    }

    /**
     * @Route("/new", name="newCookbook")
     */
    public function newAction(Request $request)
    {
        $recipe = new Recipe();

        $form = $this->createFormBuilder($recipe)
            ->add('title', TextType::class)
            ->add('description', CKEditorType::class, array(
                'config' => array(
                    'uiColor' => '#FFFFFF',
                ),
            ))
            ->add('brochure', FileType::class)
            ->add('save', SubmitType::class)
            ->getForm();

        $form->handleRequest($request);
        $em = $this->getDoctrine()->getManager();

        if ($form->isSubmitted() && $form->isValid()){

            $recipe = $form->getData();

            /** @var Symfony\Component\HttpFoundation\File\UploadedFile $file */
            $file = $recipe->getBrochure();

            // Generate a unique name for the file before saving it
            $fileName = md5(uniqid()) . '.' . $file->guessExtension();

            // Move the file to the directory where brochures are stored
            $file->move(
                $this->getParameter('images_directory'),
                $fileName
            );

            // Update the 'brochure' property to store the IMG file name
            // instead of its contents
            $recipe->setBrochure($fileName);

            $em->persist($recipe);
            $em->flush();

            return $this->redirect('/edit/' . $recipe->getId());
        }

        return $this->render('AppBundle:Cookbook:new.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * @Route("/show/{cookbookId}", name="showCookbook")
     */
    public function showAction($cookbookId)
    {
        $em = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($cookbookId);

        if(!$recipe)
            throw $this->createNotFoundException('No recipe found for id ' . $recipe);

        return $this->render('AppBundle:Cookbook:show.html.twig', [
            'recipe' => $recipe
        ]);
    }

    /**
     * @Route("/edit/{cookbookId}", name="editCookbook")
     */
    public function editAction($cookbookId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($cookbookId);

        if(!$recipe)
            throw $this->createNotFoundException('No recipe found for id ' . $recipe);

        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $data = $form->getData();

            /** @var Symfony\Component\HttpFoundation\File\UploadedFile $file */
            $file = $recipe->getBrochure();

            // Generate a unique name for the file before saving it
            $fileName = md5(uniqid()) . '.' . $file->guessExtension();

            // Move the file to the directory where brochures are stored
            $file->move(
                $this->getParameter('images_directory'),
                $fileName
            );

            // Update the 'brochure' property to store the IMG file name
            // instead of its contents
            $recipe->setBrochure($fileName);

            $em->persist($data);
            $em->flush();

            return $this->redirect('/show/' . $cookbookId);
        }

        return $this->render('AppBundle:Cookbook:edit.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @route("/recipe/find", name="search_recipe")
     */
    function findAction(Request $request)
    {
        $data = $request->request->get('data');
        $json = json_decode($data);
        $findString  = $json->searchStr;

        $em = $this->getDoctrine()->getManager();

        $query = $em->createQuery(
            'SELECT recipe
              FROM AppBundle:Recipe recipe
                WHERE recipe.title LIKE :str
                  ORDER BY recipe.id ASC'
        )->setParameter('str', '%' . $findString . '%');

        $recipe = $query->getResult();

        $serializer = $this->get('serializer');
        $json = $serializer->serialize($recipe, 'json');

        if ($recipe)
            return new Response($json);
        else
            return new Response('not_found');
    }

    /**
     * @route("/recipe/del{recipeId}", name="search")
     */
    function delAction($recipeId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $recipe = $em->getRepository('AppBundle:Recipe')->find($recipeId);

        $recipe->setIsActive(false);
        $em->persist($recipe);
        $em->flush();

        return new Response($recipeId);
    }

    /**
     * @route("/jornal", name="jornal")
     */
    function jornalAction()
    {

        return $this->render('AppBundle:Jornal:list.html.twig');
    }
}
